import React from "react";
import ChatBot from 'react-simple-chatbot';
import { Segment } from 'semantic-ui-react'

import './contact.css'

function Contact() {

    const steps = [
        {
            id: 'Greet',
            message: 'Hello , Welcome to our Website....',
            trigger: 'Ask Name'
        },
        {
            id: 'Ask Name',
            message: 'Dear Customer, Please Enter Your Name...',
            trigger: 'waiting1'
        },
        {
            id: 'waiting1',
            user: true,
            trigger: 'Name'
        },
        {
            id: 'Name',
            message: 'Hii {previousValue}, Please select your issue....',
            trigger: 'issues'
        },
        {
            id: 'issues',
            options: [
                { value: 'I Want to Sell My Products ', label: 'I want to sell my products', trigger: 'product' },
                { value: 'How do I cancel my order', label: 'How do i cancel my order?', trigger: 'order' },
                { value: 'I face Payment issue', label: 'I face payment issue', trigger: 'payment' },
                { value: 'I want to delete my account', label: 'I want to delete my account', trigger: 'delete' }


            ],

        },
        {
            id: 'product',
            message: "Please Enter Your Email... ",
            trigger: 'product2'

        },
        {
            id: 'product2',
            user: true,
            trigger: 'waiting2'
        },
        {
            id: 'waiting2',
            message: "Thank you for showing interest in partnering with us.......We will contact You shortly with your email {previousValue} ",
            trigger: 'last'
        },
        {
            id: 'order',
            message: "Open Profile icon => select orders category => swipe display and click on delete icon",
            trigger: 'last'
        },
        {
            id: 'payment',
            message: "Don't Worry, This is general issue..Try after sometime....",
            trigger: 'last'
        },
        {
            id: 'delete',
            message: "Please send your userID and full name to our email bot600629@gmail.com ",
            trigger: 'last'
        },

        {
            id: 'last',
            message: "If you have further queries, please contact bot600629@gmail.com",
            trigger: 'Name'
        },





    ]

    return <>
        <Segment floated="center">
            <ChatBot steps={steps} />

        </Segment>
    </>




}
export default Contact