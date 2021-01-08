import { CopyToClipboard } from 'react-copy-to-clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Button from '@material-ui/core/Button';

import styles from './ClinicianJoinCode.module.css';

import useSWR from '../../lib/swr';
import { mutate } from 'swr';
import { useSession } from 'next-auth/client';
import roles from '../../lib/roles';

const getCode = (id) => {
    const { data, error } = useSWR('/api/departments/' + id, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return data;
}

function ClinicianJoinCode() {
    const [session] = useSession();
    //console.log(session.user.departmentId);
    const code = getCode(session.user.departmentId);
    //console.log(code);

    const regenerateInDatabase = async id => {
        const res = await fetch('/api/join_codes/' + roles.USER_TYPE_DEPARTMENT + '/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        return await res.json();
    };

    const regenerateCode = async id => {
        await regenerateInDatabase(id)
        mutate('/api/departments/' + id);
    };

    return (
        <div className={styles.content}>
            <div className={styles.textPadding}>
                {"Please send this unique URL to clinicians so they can join your "
                    + (code !== undefined ? code["0"]["name"] : 'loading...') + " department:"}
            </div>
            <div className={styles.textPadding}>
                {window.location.hostname + '/join/clincian/' + (code !== undefined ? code["0"]["clinician_join_codes"]["code"] : 'loading...')}
            </div>
            <div className={styles.buttonPadding}>
                <div className={styles.button}>
                    <CopyToClipboard
                        text={window.location.hostname + '/join/clincian/' + (code !== undefined ? code["0"]["clinician_join_codes"]["code"] : 'loading...')}>
                        <button><FileCopyIcon fontSize="inherit" /></button>
                    </CopyToClipboard>
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => regenerateCode(session.user.departmentId)}>
                        <div className={styles.buttonText}>
                            Re-generate URL
                    </div>
                    </Button>
                </div>
            </div>
        </div>
    )
} export default ClinicianJoinCode;
