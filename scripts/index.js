import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import '../icon/main-icon.png';

const applicationServerPublicKey = 'BJKYc2RUZ6uznfb6x1y4ffUzkWaI6PwfkVN21cCGsu1ZjqTV9wg2HdwHDaZFxQFxqBojd6gkWlgDaYcTJx2rIVI';
const pushButton = document.querySelector('.push-button');
const payButton = document.querySelector('.pay-button');

const subscriptionDetails = document.querySelector('.js-subscription-json');

let swRegistration;
let isSubscribed;


if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  runtime.register()
    .then(function(swReg) {
      console.log('Service Worker is registered', swReg);

      swRegistration = swReg;
      initialiseUI();
    })
    .catch(function(error) {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.userChoice.then(function(choiceResult) {

    console.log(choiceResult.outcome);

    if(choiceResult.outcome === 'dismissed') {
      console.log('User cancelled home screen install');
    }
    else {
      console.log('User added to home screen');
    }
  });
});

// 서버에 구독 알림
function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  if (subscription) {
    alert('구독완료!');
    subscriptionDetails.textContent = JSON.stringify(subscription);
  } else {
    alert('구독취소!');
  }

}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
    .then(function(subscription) {
      console.log('User is subscribed:', subscription);

      updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      updateBtn();
    })
    .catch(function(err) {
      console.log('Failed to subscribe the user: ', err);
      updateBtn();
    });
}

const methodData = [
  {
    supportedMethods: ["visa", "mastercard"]
  }
];

var details = {
  displayItems: [
    {
      label: "Original donation amount",
      amount: { currency: "USD", value : "65.00" }, // US$65.00
    },
    {
      label: "Friends and family discount",
      amount: { currency: "USD", value : "-10.00" }, // -US$10.00
      pending: true // The price is not determined yet
    }
  ],
  total:  {
    label: "Total",
    amount: { currency: "USD", value : "55.00" }, // US$55.00
  }
}

const request = new PaymentRequest(
  methodData, // required payment method data
  details,    // required information about transaction
  //options     // optional parameter for things like shipping, etc.
);


function initialiseUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
    } else {
      subscribeUser();
    }
  });

  payButton.onclick = () => {
    request.show().then(function(paymentResponse) {
      // Process paymentResponse here
      paymentResponse.complete("success");
    }).catch(function(err) {
      console.error("Uh oh, something bad happened", err.message);
    });
};

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      isSubscribed = !(subscription === null);

      if (isSubscribed) {
        console.log('User IS subscribed.');
        subscriptionDetails.textContent = JSON.stringify(subscription);
      } else {
        console.log('User is NOT subscribed.');
      }

      updateBtn();
    });
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}