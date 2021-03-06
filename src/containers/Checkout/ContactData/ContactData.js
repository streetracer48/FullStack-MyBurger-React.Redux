import React,{Component} from 'react';
import {connect} from 'react-redux';
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/WithErrorHandler/WithErrorHandler'
import * as actions from '../../../Store/actions/index'

class ContactData  extends Component {
  state = {

      orderForm: {
 name:{

elementType:'input',
  elementConfig:{
     type:'text',
     placeholder:'Your Name'
  },
 value:'',
 validation:{
    required:true

     },
     valid:false,
     touched:false
 },

 street:{

    elementType:'input',
      elementConfig:{
         type:'text',
         placeholder:'Street'
      },
     value:'',
     validation:{
        required:true
         },
         valid:false,
         touched:false
     },

     zipcode:{
        elementType:'input',
          elementConfig:{
             type:'text',
             placeholder:'ZIP Code'
          },
         value:'',
         validation:{
        required:true,
        minLength:5,
        maxLength:5,
        isNumeric: true
         },
         valid:false,
         touched:false
         },

     country:{

        elementType:'input',
          elementConfig:{
             type:'text',
             placeholder:'Country'
          },
         value:'',
         validation:{
            required:true
             },
             valid:false,
             touched:false
    },

    email: {
        elementType: 'input',
        elementConfig: {
            type: 'email',
            placeholder: 'Your E-Mail'
        },
        value: '',
        validation: {
            required: true,
            isEmail: true
        },
        valid: false,
        touched: false
    },


    deliveryMethod:{
        elementType:'select',
          elementConfig:{
              options:[
        {value:'fastest', displayValue:'Fastest'},
    {value:'cheapest', displayValue:'Cheapest'}
            ]
          },
         value:'',
         valid:true
    }


     },

     formIsValid:false,
     loading:false
      }

 checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }
        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid

 }


    inputChangeHandler = (event, inputIdentifire) => {
        const updatedOrderForm ={
    ...this.state.orderForm
        };
        const updatedFormElement = {
...updatedOrderForm[inputIdentifire]
        };
updatedFormElement.value = event.target.value;
updatedFormElement.valid=this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
updatedFormElement.touched=true;

updatedOrderForm[inputIdentifire] = updatedFormElement;

let formIsValid = true;

for(let inputIdentifire in updatedOrderForm)
{
     formIsValid = updatedOrderForm[inputIdentifire].valid && formIsValid;

}
console.log(formIsValid);
this.setState({orderForm:updatedOrderForm, formIsValid:formIsValid});

      }


      OrderHandler = (event) => {
        event.preventDefault();
        // console.log(this.props.ingredients);
        // console.log(this.props.price);
    //     this.setState({
    //        loading: true
    //    });

 const formData = {};
for(let formElementIdentifire in this.state.orderForm) {
formData[formElementIdentifire] = this.state.orderForm[formElementIdentifire].value
}

        const order = {
           ingredients: this.props.ings,
           totalprice: this.props.price,
           orderData:formData,
           userId:this.props.userId,
           orderCondition:this.props.orderCondition
       }
        // axios.post('/orders.json', order)
        // .then(respone => { this.setState({ loading: false })
        // this.props.history.push('/')
        // })
        //    .catch(err => this.setState({
        //         loading: false
        //    }));

        this.props.onOrderBurger(order, this.props.token)
     }
  render() {
const formElementArray = []
for(let key in this.state.orderForm)
{
 formElementArray.push({
 id:key,
 config: this.state.orderForm[key]
 });

}
console.log(formElementArray)

       let form = (
           <form onSubmit={this.OrderHandler}>

{formElementArray.map(formElement =>(
    <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid ={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        change={(event)=> this.inputChangeHandler(event, formElement.id)}
/>

))}
       <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>

        </form>

    );
       if(this.props.loading) {
            form =<Spinner/>
       }

       return(
           <div className={classes.ContactData}>
           <h4>Enter your Contact Information</h4>
      {form}
           </div>

       );
  }


}

const mapStateToProps = state => {
    return {
        ings:state.burgerBuilder.ingredients,
        price:state.burgerBuilder.totalPrice,
        loading:state.order.loading,
        token:state.auth.token,
        userId:state.auth.userId,

    }
};
const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger:(orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }

};

export default connect(mapStateToProps,mapDispatchToProps) (withErrorHandler(ContactData, axios))

