// BUDGET CONTROLLER
 var budgetController = (function() {
     
     var Expense = function(id,description,value){
         this.id = id;
         this.description = description;
         this.value = value;
         this.percentage = -1;
     };
     
     Expense.prototype.calcPercentage = function(totalincome) {
         if(totalincome > 0){
         this.percentage = Math.round((this.value / totalincome) * 100);
         }else{
             this.percentage = -1;
         }
     };
     Expense.prototype.getPercentage = function(){
         return this.percentage;
     };
     
     var Income = function(id,description,value){
         this.id = id;
         this.description = description;
         this.value = value;
     };
     
     var calculateTotal = function(type) {
         var sum = 0;
         data.allItems[type].forEach(function(cur) {
             sum += cur.value;
         });
         
         data.totals[type] = sum;
     };
     
     var data = {
         allItems:{
             exp: [],
             inc: []
         },
         totals: {
             exp: 0,
             inc: 0
         },
         budget: 0,
         percentage: -1
     };
     
     return {
         addItem: function(type, des, val){
             var newItem,ID;
             
             //CREATE NEW ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{ 
                ID = 0;
              }
              //create new item based on 'inc' or 'exp'
             if(type === 'exp') {
                 newItem = new Expense(ID,des,val);
                
             }else{
                 newItem = new Income(ID,des,val);
             }
             
             // PUSH IT INTO OUR DATABASE
             data.allItems[type].push(newItem);
             return newItem;
             
         },
         
         
         deleteItems: function(types, id) {
             
             var ids,index;
             
            ids = data.allItems[types].map(function(current){
                return current.id;
            });
             
             
             index = ids.indexOf(id);
             
             if(index !== -1){
                 data.allItems[types].splice(index, 1);
             }
         },
         
         
         calculateBudget: function() {
             // calculate the total and expenses
             calculateTotal('exp');
             calculateTotal('inc');
             
             //calculate the budget :income -expenses
             data.budget = data.totals.inc - data.totals.exp;
             
             //calcualte the percentages
             if(data.totals.inc > data.totals.exp){
             data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
             }
             
         },
        calculatePercentages: function(){
            
            data.allItems.exp.forEach(function(curr){
                
                curr.calcPercentage(data.totals.inc);
            });
            
        },
         
         getPercentages: function() {
             var allpercent = data.allItems.exp.map(function(curr){
                 return curr.getPercentage();
             });
             
             return allpercent;
         },
         
         getBudget: function() {
             return {
                 budget: data.budget,
                 totalExp: data.totals.exp,
                 totalInc: data.totals.inc,
                 percentaGe: data.percentage
                 
             }
         },
        testing: function(){
            return data;
        }
     };
     
 })();


// UI controller
var UIController = (function() {
    
    var DOMstrings = {
        inputType:'.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentlabel: '.item__percentage'
    };
    
    return{
        getInput: function(){
            return{
                type:document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
          addListItem: function(obj, type) {
        var Html, newHtml, element;
              if(type === 'inc'){
                  
                  element = DOMstrings.incomeContainer;
                  Html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
              }else if (type === 'exp') {
                  
                  element = DOMstrings.expenseContainer;
                  Html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button><div class="item__percentage">21%</div></div></div></div>';
              }
              
              newHtml = Html.replace('%id%', obj.id);
              newHtml = newHtml.replace('%description%', obj.description);
              newHtml = newHtml.replace('%value%', obj.value);
              
              document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
              
    },
        deleteListItem: function(selectorid){
            var el = document.getElementById(selectorid);
            el.parentNode.removeChild(el);
            
            
        },
        
        clearFields: function(){
             
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value =  "";
            });
            
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj) {
            
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            
            if(obj.percentaGe > 0) {
            
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentaGe + '%';
            }else {
                
                obj.percentaGe = "---";
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentaGe;
            }
        },
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercentlabel);
            
            var nodelistForeach = function(list, callback){
              for( var i = 0; i < list.length; i++){
                  callback(list[i], i);
              }  
            };
            
            nodelistForeach(fields, function(current, index){
                current.textContent = percentages[index] + '%';
            });
        },
        
        getDOMstrings: function(){
            return DOMstrings;
        } 
    };
    
    
    
})();



    // GLOBAL APP CONTROLLER
   var controller = (function(budgetCtrl,UICtrl){
    
    var setUPEventListner = function(){
        var DOMbtn = UICtrl.getDOMstrings();
         document.querySelector(DOMbtn.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
            
        });
        
        document.querySelector(DOMbtn.container).addEventListener('click',ctrDeleteItems);
    
    };
       var updateBudget = function() {
           //calculate the budget
           budgetCtrl.calculateBudget();
           
           //return the budget
           var budget = budgetCtrl.getBudget();
           
           //display the budget on the ui
           UICtrl.displayBudget(budget);
       };
       
       var upatePercentages = function() {
           // calculate the percentages
           budgetCtrl.calculatePercentages();
           
           //read the percentages
           var percent = budgetCtrl.getPercentages();
           
           //display the percentages
           UICtrl.displayPercentages(percent);
       };
       
      var ctrDeleteItems = function(event) {
          
          var  itemid, splitid, type, ID;
          
               itemid = event.target.parentNode.parentNode.parentNode.parentNode.id;
         
          if(itemid) {
              splitid = itemid.split('-');
              type = splitid[0];
              ID = parseInt(splitid[1]);
              
              // DELETE THE ITEM FROM THE DATA STRUCTURE
            budgetCtrl.deleteItems(type, ID);
              
              //DELETE THE ITEM FROM THE UI
              UICtrl.deleteListItem(itemid);
              
              //UPDATE AND SHOW THE NEW BUDGET
              updateBudget();
              
              
          }
          
          
          
      };
       
       
    var ctrlAddItem = function() {
      
        // GET THE FIELD INPUT DATA
        
        var input = UICtrl.getInput();
        
          if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
        
        
          // ADD THE ITEMS TO THE BUDGET CONTROLLER
          
          var newItems = budgetCtrl.addItem(input.type,input.description,input.value);
      
               
          // ADD THE ITEM TO THE UI
           UICtrl.addListItem(newItems, input.type);
        
          // CLEAR THE FIELDS
           UICtrl.clearFields();
            
            //calculate the budget
            updateBudget();
            
            //UPDATE THE PERCENTAGES
            upatePercentages();
    }
    
    }
    
    return {
        init: function() {
            
            console.log('application has started');
            setUPEventListner();
            UICtrl.displayBudget({
                budget: 0,
                 totalExp: 0,
                 totalInc: 0,
                 percentaGe: -1
            });
            
             

        }
    };
       
    
})(budgetController,UIController);

controller.init();