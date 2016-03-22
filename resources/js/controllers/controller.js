(function(angular) {

  angular.module("app.services", [])
    .factory("getJSON", function($http){
      return{
        get: function(){
          return $http.get("resources/freddy.json");
        }
      }
  })

  angular.module("app", [/*"ngMaterial",*/ "app.services"])
    .controller("homeCtrl", ["$scope", "getJSON", function($scope, getJSON){

      /*
       * Get the data from the JSON
       */
      getJSON.get().then(function(data){
        $scope.data = data.data;
      })

    }]);



  /*
  angular.module('web',['wu.masonry'])

    .controller('Images', ['$scope', function Images($scope){
      $scope.briks = [
        "./resources/img/photos/54e3b335ecd8fa004ce9ce8a1047634a.jpg"
        , "./resources/img/photos/01233_yinyangsky_2560x1600.jpg"
        , "./resources/img/photos/01604_irony_2560x1600.jpg"
        , "./resources/img/photos/DB_IggyPop.jpg"
        , "./resources/img/photos/dropping-1.jpg"
      ]
    }]);
  */
})(window.angular);
