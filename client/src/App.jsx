// import { TextInput } from './components/input-components';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './pages/layout/MainLayout';
import UserHome from './pages/home-pages/UserHome';
import Transfer from './pages/transfer-pages/Transfer';
import Register from './pages/auth-pages/Register';
import Login from './pages/auth-pages/Login';
import RequireAuth from './auth-components/RequireAuth';
import PersistAuth from './auth-components/PersistAuth';
import ForgotPassword from './pages/auth-pages/ForgotPassword';
import ForgotPasswordCode from './pages/auth-pages/ForgotPasswordCode';
import ResetPassword from './pages/auth-pages/ResetPassword';
import VerifyEmail from './pages/auth-pages/VerifyEmail';
import RequireVerification from './auth-components/RequireVerification';
import VerificationError from './pages/error-pages/VerificationError';
import Home from './pages/home/Home';
import RequireGuest from './auth-components/RequireGuest';
import Transactions from './pages/transactions-pages/Transactions';
import ShowTransaction from './pages/transactions-pages/ShowTransaction';
import TransferTargetUser from './pages/transfer-pages/TransferTargetUser';
import Category from './pages/payment-pages/Category';
import CategoryCompanies from './pages/payment-pages/CategoryCompanies';
import Payment from './pages/payment-pages/Payment';
import VerifyTransfer from './pages/transfer-pages/VerifyTransfer';
import VerifyPayment from './pages/transactions-pages/VerifyPayment';
import ChargingPointLogin from './pages/auth-pages/ChargingPointLogin';
import ChargingTargetUser from './pages/charging-pages/ChargingTargetUser';
import Charging from './pages/charging-pages/Charging';
import VerifyCharging from './pages/charging-pages/VerifyCharging';
import CompanyHome from './pages/home-pages/CompanyHome';
import ChargingPointHome from './pages/home-pages/ChargingPointHome';
import { useSelector } from 'react-redux';
import CmsLogin from './pages/cms-pages/CmsLogin';
import CmsHome from './pages/cms-pages/CmsHome';
import TransactionsReport from './pages/cms-pages/TransactionsReport';
import TransactionReport from './pages/cms-pages/TransactionReport';
import Users from './pages/cms-pages/Users';
import UserDetails from './pages/cms-pages/UserDetails';
import AuthorizeGuard from './auth-components/AuthorizeGuard';
// import Transactions from './pages/transactions-pages/Transactions';
// import ShowTransaction from './pages/transactions-pages/ShowTransaction';
function App() {
  return (
    <div className='app'>
      <Routes>
      <Route element={<PersistAuth/>}>
          {/* Landing Page */}
        <Route element={<RequireGuest/>}>
          <Route path='/' element={<Home/>}/>
              {/* auth routes*/}
          <Route path='/login' element={<Login/>}/>
          <Route path='/cms/login' element={<CmsLogin/>}/>
          <Route path='/charging-point/login' element={<ChargingPointLogin/>}/>
          <Route path='/register' element={<Register/>}/>
          {/* forgot password routes*/}
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/forgot-password/code' element={<ForgotPasswordCode/>}/>
          <Route path='/reset-password' element={<ResetPassword/>}/>
        </Route>
     
      {/* verify account routes */}
      <Route path='/verification-error' element={<VerificationError/>}/>
      <Route path='/verify-email' element={<VerifyEmail/>}/>
      {/* CMS routes */}
      <Route element={<RequireAuth type='cms'/>}>
        <Route element={<AuthorizeGuard guards={['systemOwner']}/>}>
          <Route element={<MainLayout/>}>
            <Route path='/cms/home' element={<CmsHome/>}/>
            <Route path='/cms/transactions-report' element={<TransactionsReport/>}/>
            <Route path='/cms/transaction-report/:transaction_id' element={<TransactionReport/>}/>
            <Route path='/cms/users/:guard' element={<Users/>}/>
            <Route path='/cms/users/:guard/:user_id' element={<UserDetails/>}/>
          </Route>
        </Route>
      </Route>
      {/* protected routes */}
      <Route element={<RequireAuth/>}>
        <Route path='/' element={<MainLayout/>}>
          <Route element={<RequireVerification/>}>
            <Route path='/home' element={<UserHome/>}/>
            <Route element={<AuthorizeGuard guards={['user']}/>}>
              {/* transfer */}
              <Route path='/target-user' element={<TransferTargetUser/>}/>
              <Route path='/transfer' element={<Transfer/>}/>
              <Route path='/verify-transfer' element={<VerifyTransfer/>}/>
              {/* payment */}
              <Route path='/category' element={<Category/>}/>
              <Route path='/category-companies/:categoryId' element={<CategoryCompanies/>}/>
              <Route path='/payment/:companyId' element={<Payment/>}/>
              <Route path='/verify-payment' element={<VerifyPayment/>}/>
            </Route>
            {/* charging */}
            <Route element={<AuthorizeGuard guards={['chargingPoint']}/>}>
              <Route path='/charging-target-user' element={<ChargingTargetUser/>}/>
              <Route path='/charging' element={<Charging/>}/>
              <Route path='/verify-charging' element={<VerifyCharging/>}/>
            </Route>
            
            {/* transactions */}
            <Route element={<AuthorizeGuard guards={['company','user','chargingPoint']}/>}>
              <Route path='/transactions' element={<Transactions/>}/>
              <Route path='/transactions/:transaction_id' element={<ShowTransaction/>}/>
            </Route>
          </Route>
        </Route>
        </Route>
      </Route>
      </Routes>
    </div>
  )
}

export default App
