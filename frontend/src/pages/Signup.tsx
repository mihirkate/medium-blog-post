import Auth from "../components/Auth";
import Quote from "../components/Qoute";

export default function Signup() {
    return <div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
                <Auth type="signup"/> 
            
                </div>

            <div className ="none lg:block">

            <Quote />
            </div>
        </div>
    </div>
}