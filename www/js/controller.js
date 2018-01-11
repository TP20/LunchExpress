
angular.module('todo.controller',['ionic', 'todo.services', "firebase"])


.controller('TabsCtrl', function ($scope) {

})

.controller('LoginCtrl', function ($scope, Items, User, ViewCount, $ionicPopup) {
  $scope.user ="Regular User";

  $scope.setUser = function (user) {
    User.setUser(user);
  }

  $scope.isAdminUser = function () {
    return (User.getUser() === "Admin");
  }
})

.controller('MainCtrl', function ($scope) {

})

.controller('MenuCtrl', function ($scope, $state, $ionicModal, $ionicPopup, $ionicHistory, Order, User, Items) {

    $scope.menu = function () {
      $scope.setVisibility();
    	// return Items.menuList;
      //Items.Menu.setMenuList();
      var test = Items.Menu.getMenuList();
      return test;

    }

    // $scope.showPopup = function () {
    //   $scope.data = {};
    // }

    $ionicModal.fromTemplateUrl ('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }) . then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function (val) {
      $scope.foodItem = val;
      $scope.modal.show();
    };

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $scope.addItemList = function () {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<input type="text" placeholder="Name" ng-model="data.item"> <br> <input placeholder="Price" ng-model="data.price" type="number">',
        title: 'Add Item',
        subTitle: 'Please enter name and cost',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Add</b>',
            type: 'button-energized',
            onTap: function (e) {
              if (!$scope.data.item || !$scope.data.price ) {
                e.preventDefault();
              } else {
                Items.Menu.addItemToDb({item:$scope.data.item, price:$scope.data.price});
                return $scope.data.item;
              }
            }
          }
        ]
      });
    }

    $scope.showAlert = function () {
    	var alertPopUp=  $ionicPopup.alert({
    		title: 'Budget is $'+Order.budget,
    		template: 'You\'ve reached the limit!',
    		okType: 'button-energized'
    	});
    };

    $scope.removeItem = function (item) {
    	var t = $scope.menu().indexOf(item);
    	$scope.menu().splice(t, 1);
    };

    $scope.add = function (food) {
      if (Order.total+food.price < Order.budget) {
      //	Order.addFoodToCartList(food);
        Order.CartList.pushFoodItem(food);
      	Order.Total.addToTotal(food.price);
        // Items.popFoodItem(food);
        Items.Menu.popFoodItem(food);
      }
      else {
      	this.showAlert();
      }
    };

    $scope.setVisibility = function () {
      // return (Items.menuList.length !== 0);
      return (Items.Menu.getMenuList().length !== 0);
      // return (1 !== 0);

    }

    $scope.addToCost = function (amount) {
     	Order.Total.addToTotal(amount);
    };

    $scope.totalVal = function () {
      if (Order.total < 0) {
    		return "Please Select an Item";
    	}
    	else
    	  return Order.total;
    }
})

.controller('OrderCtrl', function ($scope, $ionicPopup, Order, Restaurant, User,  Items)  {
		$scope.cartList = (function () {
			  return {
					getList : function () {
						return Order.cartList;
					},
					remove : function (foodItem) {
					//	Order.removeFromCartList(foodItem);
            Order.CartList.removeFoodItem(foodItem);
					}
				}
		})();

		$scope.menuList = (function () {
			  return {
					add : function (foodItem) {
					  // Items.pushFoodItem(foodItem);
            Items.Menu.pushFoodItem(foodItem);

					}
				}
		})();

		$scope.cost = (function () {
			function getTotal () {
				return Order.total;
			}

			function deduct (amount) {
				// Order.subtractFromTotal(amount);
        Order.Total.subtractFromTotal(amount);

			}

			return {
				getTotal : getTotal,
				deduct : deduct
			}
		})();

		$scope.setVisibility =  (function () {
		  function totalAmountText () {
				return (Order.Total.getTotal() <= 0);
			}

			function amountNullText () {
				return (Order.Total.getTotal() > 0);
			}

			return {
			  totalAmountText: totalAmountText,
				amountNullText: amountNullText
			}
		})();

    $scope.placeOrder = function () {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.name">',
        title: 'Place Order',
        subTitle: 'Please enter your name',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Submit</b>',
            type: 'button-energized',
            onTap: function(e) {
             if (!$scope.data.name) {
               e.preventDefault();
             } else {
              // Order.addToPlacedOrderList($scope.data.name);
               Order.PlacedOrderList.addOrder($scope.data.name);
              // Items.Menu.setMenuRef(Restaurant.getRestaurant());
               Items.Menu.setMenuList();
               //Items.Menu.getMenuList();
              // Items.Menu.setMenuList(Restaurant.getRestaurant());
             }
            }
          }
        ]
      });
    }
})

.controller('RegisterCtrl', function ($scope) {

})

.controller('RestaurantCtrl', function ($scope, $state, $ionicModal, $ionicPopup, Order, Items, User, ViewCount, Restaurant) {
  $state.go($state.current, {}, {reload:true});

  $scope.restaurantList= Items.Restaurants.getRestaurantImageMap();

  $scope.isAdminUser = function () {
    return (User.getUser() === "Admin");
  }

  $scope.showInstructions = function() {
    if (ViewCount.menu < 1) {
      var alertPopup = $ionicPopup.alert({
        title: '<b>Tip</b>',
        template: '<p style="text-align:center"> Swipe to Add to Cart </p>',
        buttons: [{
        type: 'button-energized',
        text: '<b>OK</b>'}
        ]
      });
    }
    ViewCount.incrementMenuPageCount();
  }

  $scope.addRestaurant = function () {
    $scope.data = {};
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.restaurant">',
      title: 'Add Restaurant',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Add</b>',
          type: 'button-energized',
          onTap: function(e) {
            console.log($scope.data.restaurant);
           if (!$scope.data.restaurant) {
             e.preventDefault();
           } else {
             Items.Restaurants.addRestaurant($scope.data.restaurant);
           }
          }
        }
      ]
    });
  }

  $scope.setRestaurant = function (selectedRestaurant) {
    if (selectedRestaurant !== Restaurant.getRestaurant()) {
	    while (Order.CartList.getList().length !== 0) {
			  Order.Total.subtractFromTotal(Order.CartList.getList()[0].price);
			  Order.CartList.getList().shift();
		  }
		//  Items.Menu.setMenuList(selectedRestaurant);
      Items.Menu.setMenuRef(selectedRestaurant);
      Items.Menu.setMenuList();
      Restaurant.setRestaurant(selectedRestaurant);
	  }
  }
})

// .controller('PlaceOrderCtrl', function ($scope, $ionicModal, Order, User) {
//   // $scope.placedOrders = Order.PlacedOrderList.getList();//Order.getPlacedOrderList();
// })

.controller('ViewOrderCtrl', function ($scope, $ionicModal, Order, User) {

   $scope.placedOrderList = Order.PlacedOrderList.getList(); //Order.PlacedOrderList.getList();//Order.getPlacedOrderList();

   $scope.clearPlacedOrderList = function () {
     Order.PlacedOrderList.clear();
   }

   $scope.setVisibility = (function () {
     return {
       text: function () {
         return (Order.placedOrderList.length > 0);
       },

       clearButton: function () {
         return (Order.placedOrderList.length <=  0 || (User.getUser() !=="Admin"));
       }
     }
   })();
})

.controller('AddCtrl', function ($scope) {

});
