import { useEffect, useState } from 'react'
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Link, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import Image from '../../../components/image';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider from '../../../components/hook-form';
import axios from '../../../utils/axios';
import { textEllipsis } from 'src/utils/utils';
import Iconify from 'src/components/iconify';

export default function SendReward() {
    const { push, query } = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const [reward, setReward] = useState({} as IReward)
    const [isCopied, setCopied] = useState(false)

    const methods = useForm<any>({});

    const { handleSubmit } = methods;
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            const res = await axios.post('update-reward', { id: reward.id, status: reward.status });
            if (res.status === 200) {
                enqueueSnackbar('Reward updated successfully', { variant: 'success' });
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Failed to update reward', { variant: 'error' });
        } finally {
            setLoading(false);
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

    const fetchReward = async () => {
        try {
            const rewardId = query.id;
            const res = await axios.post('get-reward', { id: rewardId });

            if (res.status === 200) {
                setReward(res.data.rewardData);
            }
        } catch (err) {
            console.error(err);
            // enqueueSnackbar('Failed to fetch reward', { variant: 'error' });
        }
    };

    useEffect(() => {
        fetchReward();
    }, [query.id]);

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>

                <Grid item xs={12} md={4}>
                    <Link href={`https://steamcommunity.com/profiles/${reward.userId}`} target="_blank" rel="noopener">
                        <Card sx={{ py: 3, px: 3 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, mx: { md: 4 } }}>
                                <Box sx={{
                                    borderRadius: "50%",
                                    borderStyle: reward.avatar ? 'dashed' : "none",
                                    borderColor: 'gray',
                                    p: 0.5
                                }}>
                                    <Image
                                        visibleByDefault
                                        alt={reward.fullName}
                                        src={reward.avatar}
                                        sx={{ borderRadius: 50 }}
                                    />
                                </Box>
                                {reward.fullName && <Label color="primary" sx={{ py: 2, fontSize: 15, cursor: "pointer" }}>{reward.fullName}</Label>}
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
                                <Typography variant="body1" gutterBottom>{reward.id}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="body1" color={'gray'} gutterBottom>Profit Amount</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="body1" gutterBottom>$ {reward.amount}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="body1" color={'gray'} gutterBottom>To Address</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Box display={'flex'} gap={1} alignItems="flex-start">
                                    <Typography variant="body1" gutterBottom>
                                        {textEllipsis(reward.address)}
                                    </Typography>
                                    <Iconify
                                        icon={isCopied ? "mdi:checkbox-marked-outline" : "mdi:checkbox-multiple-blank-outline"}
                                        width={isCopied ? 22 : 20}
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => onCopy(reward.address)}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="body1" color={'gray'} gutterBottom>Network</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="body1" gutterBottom>{reward.network}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" color={'gray'} gutterBottom>Status</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <FormControl sx={{ minWidth: 120 }} size="small">
                                    <Select
                                        value={reward.status || 'pending'}
                                        onChange={(e) => setReward({ ...reward, status: e.target.value })}
                                    >
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                        <MenuItem value="accepted">Accepted</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="body1" color={'gray'} gutterBottom>Date</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="body1" gutterBottom>{new Date(reward.updatedAt * 1000).toLocaleDateString()}</Typography>
                            </Grid>
                        </Grid>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton loading={loading} sx={{ display: 'flex', justifyContent: 'center', gap: 1 }} type="submit" variant="contained">
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
