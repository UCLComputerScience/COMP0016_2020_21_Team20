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
                        href="https://trello.com/b/fi4gSTRu/cq-dashboard-feedback"
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
