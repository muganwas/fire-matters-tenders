import React from 'react';
import { connect } from 'react-redux';
import './contactForm.css';
import { Textfield, Textarea } from 'components';
import Button from '@material-ui/core/Button';

const submitbutton = {
    color: "#fff",
    backgroundColor: "#ED2431",
    margin: "2px 6px"
}

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class ContactForm extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render(){
        return(
            <div id="contact-form" >
                <div className="heading hanad">Contact Form</div>
            
                <div className="contactForm hanad">
                    <div className="inputRow hanad">
                        <Textfield id="fullName" type="text" placeholder="John Doe" fieldClass="textfield" />
                    </div>
                    <div className="inputRow hanad">
                        <Textfield id="emailAddress" type="email" placeholder="JohnDoe@email.com" fieldClass="textfield" />
                    </div>
                    <div className="inputRow hanad">
                        <Textfield id="phoneNumber" type="number" placeholder="Phone Number" fieldClass="textfield" />
                    </div>
                    <div className="inputRow hanad">
                        <Textarea id = "message" rows={5}  placeholder="Message" fieldClass="textArea" />
                    </div>
                    <div className="inputRow left athird">
                        <Button variant="outlined" style={ submitbutton } className="login-button hanad" >
                            Send Message
                        </Button>            
                    </div>
                    <div className="clear"></div>
                </div>
            </div>
        )
    }
}

export default ContactForm;