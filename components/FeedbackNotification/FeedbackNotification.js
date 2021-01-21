import { Message } from 'rsuite';
import styles from './feedbackNotification.module.css';

function FeedbackNotification() {
    return(
        <div className={styles.feedback}>
            <Message
                closable
                type="info"
                description={
                    <a
                        href="https://forms.office.com/Pages/ResponsePage.aspx?id=_oivH5ipW0yTySEKEdmlwqQsVN_qV_tIhIq5N2SskKtUNU1XTkZUVlFPUVhJQ0o2UEFQNTM1NVg5Ti4u"
                        target="_blank"
                        rel="noopener noreferer">
                        We'd love your feedback!
                    </a>
                }
            />
        </div>
    );
}

export default FeedbackNotification;
