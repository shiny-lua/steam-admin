import { useEffect, useState } from 'react'
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Link, TextField, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import Image from '../../../components/image';
import { CustomFile } from '../../../components/upload';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
    RHFSelect,
    RHFSwitch,
    RHFTextField,
    RHFUploadAvatar,
} from '../../../components/hook-form';
import axios from '../../../utils/axios';
import { FormValuesProps } from '../blog/BlogNewPostForm';
import { textEllipsis } from 'src/utils/utils';
import { width } from '@mui/system';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

export default function SendProfit() {
    const { push, query } = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const [claim, setClaim] = useState({} as IClaim)
    const [isCopied, setCopied] = useState(false)

    const methods = useForm<FormValuesProps>({});

    const { handleSubmit } = methods;

    const onSubmit = async (data: FormValuesProps) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            push(PATH_DASHBOARD.user.list);
            console.log('DATA', data);
        } catch (error) {
            console.error(error);
        }
    };

    const onCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            enqueueSnackbar('Copied to clipboard!', { variant: 'success' });
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            enqueueSnackbar('Failed to copy!', { variant: 'error' });
        }
    }

    const fetchClaim = async () => {
        try {
            const claimId = query.id;
            console.log(claimId)
            if (!claimId) {
                enqueueSnackbar('No claim ID provided', { variant: 'error' });
                return;
            }

            const res = await axios.post('get-claim', { id: claimId });

            if (res.status === 200) {
                setClaim(res.data.claimsData);
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Failed to fetch claim', { variant: 'error' });
        }
    };

    useEffect(() => {
        fetchClaim();
    }, [query.id]);
    
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>

                <Grid item xs={12} md={4}>
                    <Link href={`https://steamcommunity.com/profiles/${claim.userId}`} target="_blank" rel="noopener">
                        <Card sx={{ py: 3, px: 3 }}>
                            <Box display={'flex'} flexDirection={'column'} gap={5} md={{ mx: 4 }}>
                                <Box sx={{
                                    borderRadius: "50%",
                                    borderStyle: claim.avatar ? 'dashed' : "none",
                                    borderColor: 'gray',
                                    p: 0.5
                                }}>
                                    <Image
                                        visibleByDefault
                                        alt={claim.fullName}
                                        src={claim.avatar}
                                        sx={{ borderRadius: 50 }}
                                    />
                                </Box>
                                {claim.fullName && <Label color="primary" sx={{ py: 2, fontSize: 15, cursor: "pointer" }}>{claim.fullName}</Label>}
                            </Box>
                        </Card>
                    </Link>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="body1" color={'gray'} gutterBottom>ID</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="body1" gutterBottom>{claim.id}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="body1" color={'gray'} gutterBottom>Profit Amount</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="body1" gutterBottom>$ {claim.amount}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="body1" color={'gray'} gutterBottom>To Address</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Box display={'flex'} gap={1} alignItems="flex-start">
                                    <Typography variant="body1" gutterBottom>
                                        {textEllipsis(claim.address)}
                                    </Typography>
                                    <Iconify
                                        icon={isCopied ? "mdi:checkbox-marked-outline" : "mdi:checkbox-multiple-blank-outline"}
                                        width={isCopied ? 22 : 20}
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => onCopy(claim.address)}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="body1" color={'gray'} gutterBottom>Network</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="body1" gutterBottom>{claim.network}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="body1" color={'gray'} gutterBottom>Status</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Label color={(claim.status === 'failed' && 'error') || (claim.status === 'pending' && 'warning') || (claim.status === 'expired' && 'info') || 'success'}>{claim.status}</Label>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="body1" color={'gray'} gutterBottom>Date</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="body1" gutterBottom>{new Date(claim.updatedAt * 1000).toLocaleDateString()}</Typography>
                            </Grid>
                        </Grid>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton sx={{display: 'flex', justifyContent: 'center', gap: 1}}  type="submit" variant="contained">
                                <Typography variant="body1">Send</Typography>
                                <Iconify
                                    icon="mdi:send-outline"
                                    width={22}
                                    sx={{ cursor: 'pointer' }}
                                />
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider >
    );
}
