import { CopyToClipboard } from 'react-copy-to-clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Button from '@material-ui/core/Button';

import styles from './ClinicianJoinCode.module.css';

import useSWR from '../../lib/swr';
import { mutate } from 'swr';
import { useSession } from 'next-auth/client';

const getCode = (id) => {
    const { data, error } = useSWR('/api/departments/' + id, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return data;
}

function ClinicianJoinCode() {
    const [session] = useSession();
    console.log(session.user.departmentId);
    const code = getCode(session.user.departmentId);
    //console.log(code);

    return (
        <div className={styles.content}>
            <div>
                Please send this unique URL to clinicians so they can join your department:
            </div>
            <div>
                {window.location.hostname + '/join/clincian/' + code}
            </div>
            <div className={styles.button}>
                <CopyToClipboard
                    text={window.location.hostname + '/join/clincian/' + code}>
                    <button><FileCopyIcon fontSize="inherit" /></button>
                </CopyToClipboard>
            </div>
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => console.log(window.location.hostname + '/join/clincian/' + code)}>
                    <div className={styles.buttonText}>
                        Re-generate URL
                    </div>
                </Button>
            </div>
        </div>
    )
} export default ClinicianJoinCode;
