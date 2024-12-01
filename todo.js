/**
 * User (api)
 *  -create account using national_id, email, phone *
 *      - verification using email message *
 *  -login, logout, password-reset *
 *  -transfer
 *      -enter target_phone, amount, info(optional) *
 *  -payment *
 *      -show companies categories
 *      -when user select category, show companies of that category each one has name and photo
 *      -after select company, enter the amount with info about the process
 *      -verify the balance is enough
 *  -transactions *
 *      - payments (target details, amount)
 *      - chargings (source details, amount)
 *  
 * 
 * 
 * 
 * SystemOwner *
 *  - add categories *
 *  - add company -
 *  - add ch-point *
 *      - operations on ch-point
 *          - pending, *
 *            delete, *
 *            update 
 *  - reports:
 *      - all system transactions on one day with period, e.g:(12pm - 5pm)  *
 *      - all charging point transactions on one day with period, e.g:(12pm - 5pm) *
 *      - all company payment transactions on one day with period, e.g:(12pm - 5pm) *
 *      - all user transactions on one day with period, e.g:(12pm - 5pm) *
 *  - view transaction page *   
 *  - view users *
 * 
 * 
 * Company
 *  auth *
 *  -shows company transactions (user-payments) *
 * 
 * 
 * ChargingPoint (api) 
 *  - created by the system owner (name, email, phone)
 *  - charging
 *      -enter target_phone
 *          -the system shows user informations (name, national_id, email) *
 *          -enter amount *
 *          -send verification code for user email 
 *          -after charging process send email for inforamtion such amount, employee name, charging-point name
 * 
 * 
 * 
 * 
 * 
 *  
 * */




// authorization and authentication *
    // => web *
    // => api *

// views
//  => system-owner 
        // => reports * 
        // => users *
//  charging-point 
    // my transactions *
    // transactions page


// generate verification code for transaction *



// superAdmin *

// validations *
    // => web *
    // => api *

// wrokflows *
/**
 * charging *
 *  - show charging page
 *  - enter target user phone
 *  - show user details
 *  - enter amount 
 *  - show verification page with operation details
 *  - verify
 * 
 * payment *
 *  show categories
 *  select category
 *  show category companies
 *  select company
 *  enter amount
 *  verify 
 * 
 * 
 * transfer *
 *  enter user phone => user 
 *  show user date and enter amount
 *  transfer => transaction and operation
 *  show verification page
 *  verify
 * 
 * */ 

