// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('todo', ['ionic', 'todo.controller', "firebase" ])

//
// .run(function($ionicPlatform) {
//   $ionicPlatform.ready(function() {
//     if(window.cordova && window.cordova.plugins.Keyboard) {
//       // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//       // for form inputs)
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//
//       // Don't remove this line unless you know what you are doing. It stops the viewport
//       // from snapping when text inputs are focused. Ionic handles this internally for
//       // a much nicer keyboard experience.
//       cordova.plugins.Keyboard.disableScroll(true);
//     }
//     if(window.StatusBar) {
//       StatusBar.styleDefault();
//     }
//   });
// })

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

     .state('tabs', {
  			url:'/tabs',
        abstract:true,
  			templateUrl:'templates/tabs.html',
  			controller: 'TabsCtrl'
		})

		.state('tabs.menu', {
			url: '/menu',
			views: {
  			'tab-menu': {
          cache: false,
  			    templateUrl: 'templates/menu.html',
  			    controller: 'MenuCtrl'
         }
			}
		})

		.state('tabs.cart', {
			url: '/cart',
			views: {
        'tab-cart': {
			    templateUrl: 'templates/order.html',
			    controller: 'OrderCtrl'
        }
			}
		})

   .state('loginPage', {
     url:'/login',
     templateUrl: 'templates/login.html',
     controller: 'LoginCtrl'
   })

   .state('restaurantPage', {
     url: '/restaurantPage',
     templateUrl : 'templates/restaurant.html',
     controller: 'RestaurantCtrl'
   })

   .state('viewOrders', {
     url: '/viewOrdersPage',
     templateUrl : 'templates/viewOrders.html',
     controller: 'ViewOrderCtrl'
   })

	$urlRouterProvider.otherwise('/login');
});
