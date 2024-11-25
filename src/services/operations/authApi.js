import {toast} from "react-hot-toast"
import { setLoading, setToken } from "../../slice/authSlice" 
import { resetCart } from "../../slice/cartSlice"
import {setUser}  from "../../slice/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

// Functions to make async backend calls with data from UI or store and then to update UI or control the navigation after receiving response.
export function sendOtp(email, navigate){

  return async (dispatch) => {
     const toastId = toast.loading("Loading...")
     dispatch(setLoading(true));
     
    //  console.log(email)
     try {
      
     
      const response = await apiConnector("POST", SENDOTP_API, {
        email:email,
        checkUserPresent: true,
      })

      if(!response.data.success){
        throw new Error(response.data.message)
      }


      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
     } catch (error) {
      console.error("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
     }
    //  console.log("checking error : 4")
     dispatch(setLoading(false));
     toast.dismiss(toastId);
  }
}

export function signUp( 
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
){
  return async (dispatch) => {
     const toastId = toast.loading("Loading...")
     dispatch(setLoading(true));

     try {
      const image=`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        image,
      })

      // console.log("SIGNUP_API RESPONSE............", response)

      // console.log(response.data.success)

      if(!response.data.success){
        throw new Error(response.data.message)
      }

      toast.success("Signup successful")
      navigate("/login")
     } catch (error) {
      console.error("SIGNUP_API ERROR............", error)
      toast.error("Could Not Sign up user")
     }
     dispatch(setLoading(false));
     toast.dismiss(toastId);
  }
}

export function login(email, password, navigate){
  return async (dispatch) => {
     const toastId = toast.loading("Loading...")
     dispatch(setLoading(true));

     try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      // console.log("LOGIN API RESPONSE............", response)

      // console.log(response.data.success)

      if(!response.data.success){
        throw new Error(response.data.message)
      }

      toast.success("Login Successfully")
      dispatch(setToken(response.data.token));
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response?.data?.user?.firstName} ${response?.data?.user?.lastName}`
      response.data.user.image=userImage
      dispatch(setUser({ ...response.data.user, image: userImage }))
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user)) 
      navigate("/dashboard/my-profile")
     } catch (error) {
      console.error("LOGIN API ERROR............", error)
      toast.error("Could Not LOGIN")
     }
     dispatch(setLoading(false));
     toast.dismiss(toastId);
  }
}

export function logout(navigate) {
  return (dispatch)=>{
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out")
    navigate("/")
  }
}

export function getPasswordResetToken(email, setEmailSent){
  return async(dispatch) =>{
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true));

    try {
     const response = await apiConnector("POST", RESETPASSTOKEN_API, {email});
    //  console.log("RESETPASSTOKEN_API RESPONSE............", response)

    //   console.log(response.data.success)

      if(!response.data.success){
        throw new Error(response.data.message)
      }
    
      toast.success("Mail Sent successful")
      setEmailSent(true);
    } catch (error) {
      console.error("RESETPASSTOKEN_API ERROR............", error)
      toast.error("Could Not Send Mail")
    }
    dispatch(setLoading(false));
     toast.dismiss(toastId);
  }
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async(dispatch)=>{
    const toastId = toast.loading("Loading in reset password")
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token})

      // console.log("RESETPASSWORD_API RESPONSE............", response)

      // console.log(response.data.success)

      if(!response.data.success){
        throw new Error(response.data.message)
      }
    
      toast.success("Password reset successful")
      navigate('/login')

    } catch (error) {
      console.error("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
}