angular.module('todo.services', ["firebase"])

.factory('Order', function () {

   var placedOrdersRef = new Firebase ("https://testing-2dfbb.firebaseio.com/lunchApp/placedOrders");

   var o = {
     cartList: [],
     placedOrderList: [],
     total:0,
     budget:50 //need's to be dynamic
   };

    o.CartList = (function () {
     return {
       pushFoodItem : function (foodItem) {
         o.cartList.push(foodItem);
       },

       removeFoodItem: function (foodItem) {
          o.cartList.splice(o.cartList.indexOf(foodItem), 1);
       },

       getList : function () {
         return o.cartList;
       }
     }
    })();

    o.PlacedOrderList = (function () {
      return {
        addOrder : function (name) {
          var count=0;
          placedOrdersRef.push({"name":name,"orders":angular.copy(o.cartList)});
          //o.getPlacedOrderList();
          this.getList();
          while (o.cartList.length > 0) {
            o.cartList.pop();
            o.total=0;
          }
        },

        getList : function () {
          placedOrdersRef.on("value", function (snapshot) {
            while(o.placedOrderList.length>0) {
              o.placedOrderList.pop();
            }
            snapshot.forEach(function (childSnapshot) {
              o.placedOrderList.push(childSnapshot.val());
            });
          });
          return o.placedOrderList;
        },

        clear :function () {
          placedOrdersRef.remove();
        }
      }
   })();

   o.Total = (function () {
     return {
       addToTotal : function (amount) {
         o.total = o.total + amount;
       },

       subtractFromTotal : function (amount) {
         o.total = o.total - amount;
       },

       getTotal : function () {
         return o.total;
       }
     }
   })();

   return o;
})

.factory('ViewCount', function () {
  var o = {
    menu:0
  };

  o.incrementMenuPageCount = function () {
    o.menu++;
  }

  return o;
})

.factory("Items", function ($firebaseArray, $firebase) {
    var o = {};

    var rootRef = new Firebase("https://testing-2dfbb.firebaseio.com/lunchApp");
    o.restaurantDb = new Firebase("https://testing-2dfbb.firebaseio.com/lunchApp/restaurants/");
  //  o.rootRef = new Firebase("https://testing-2dfbb.firebaseio.com/lunchApp");
    o.restaurantRef="";
    // o.selectedRestaurant ="";

    o.Menu = (function () {
      var menuRef = "";
      var menuList = [];

      function resetMenuList () {
        while (this.menuList.length > 0) {
          this.menuList.pop();
        }
      }

      // function getMenuList (restaurant) {
      //   return menuList;
      // }

      function setMenuRef(restaurant) {
        menuRef = rootRef.child("restaurants/"+restaurant+"/menu");
      }

      function setMenuList () {
         menuList = [];
         menuRef.on("value", function (snapshot) {
           snapshot.forEach(function (childSnapshot) {
             menuList.push(childSnapshot.val());
          });
        });
      }

      function getMenuList () {
        return menuList;
      }

      function addItemToDb (item) {
        menuRef.push(item);
      }

      function pushFoodItem (item) {
        menuList.push(item);
      }

      function popFoodItem (item) {
        menuList.splice(menuList.indexOf(item),1);
      }

      return {
        setMenuRef: setMenuRef,
        setMenuList: setMenuList,
        addItem: addItem,
        pushFoodItem: pushFoodItem,
        popFoodItem: popFoodItem,
        getMenuList: getMenuList
      }
    })();

    o.Restaurants = (function () {
      var restaurantRef = "";

      function getRestaurantImageMap () {
        var r= [];

        o.restaurantDb.on("value", function (snapshot) {
          while(r.length>0){
            r.pop();
          }
          snapshot.forEach(function (childSnapshot) {
            if (childSnapshot !== "") {
              r.push({name:childSnapshot.key(), image:childSnapshot.val().img});
            }
          });
        });

        return r;
      }

      function addRestaurant (restaurant) {
        var restaurantsRef = rootRef.child("restaurants");

        restaurantsRef.update({
          [restaurant]:{"img" : "img/unknown_demo.png",
    			             "menu" : ""}
        });
      }

      return {
        getRestaurantImageMap : getRestaurantImageMap,
        addRestaurant: addRestaurant
      }

    })();

    return o;
})

.factory('User', function () {
    var o = {
      user:""
    };

    o.setUser = function (user) {
      o.user = user;
    }

    o.getUser = function () {
      return o.user;
    }

    return o;
})

.factory('Restaurant', function () {
    var r = {
      selectedRestaurant: ""
    };

    r.getRestaurant = function () {
      return r.selectedRestaurant;
    };

    r.setRestaurant = function (restaurant) {
      r.selectedRestaurant = restaurant;
    };

    return r;
});
