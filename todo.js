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
 * SystemOwner...
 * 
 * 
 * 
 * Company
 *  auth *
 *  -shows company transactions (user-payments) *
 * 
 * 
 * ChargingPoint (Dashboard) 
 *  - created by the system owner (name, email, phone)
 *  - charging
 *      -enter target_phone
 *          -the system shows user informations (name, national_id, email)
 *          -enter amount
 *          -send verification code for user email
 *          -after charging process send email for inforamtion such amount, employee name, charging-point name
 * 
 * 
 * 
 * 
 * 
 *  
 * */
