import appConfig from '@/config/appConfig'
import Recaptcha from 'react-google-recaptcha'
 
const Capcha = ({setIsDone}: {setIsDone: (status: boolean) => void}) => {
    return (
        <div>
            <Recaptcha onChange = {()=>setIsDone(true)} sitekey={appConfig.CAPTCHA_KEY}/>
        </div>
    )
}

export default Capcha