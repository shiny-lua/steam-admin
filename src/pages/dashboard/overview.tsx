// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Button } from '@mui/material';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// _mock_
import {
  _ecommerceNewProducts,
  _ecommerceSalesOverview,
  _ecommerceBestSalesman,
  _ecommerceLatestProducts,
  _bookings,
} from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  EcommerceYearlySales,
  EcommerceBestSalesman,
  EcommerceWidgetSummary,
} from '../../sections/@dashboard/general/overview';
import { AppWidgetSummary } from '../../sections/@dashboard/general/app';
import { AnalyticsWebsiteVisits } from 'src/sections/@dashboard/general/analytics';
import { BookingDetails, BookingRoomAvailable, BookingWidgetSummary } from 'src/sections/@dashboard/general/booking';
import { BookingIllustration, CheckInIllustration, CheckOutIllustration } from 'src/assets/illustrations';
import { useEffect, useState } from 'react';
import axios from 'src/utils/axios';


GeneralEcommercePage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function GeneralEcommercePage() {

  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const [status, setStatus] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRewardRequests: 0,
    totalPendingRewards: 0,
    totalAcceptedRewards: 0,
    visitStats: [],
    bestCustomers: [],
    yearlySales: [],
    monthlySales: [],
    rewardRequests: [],
    userStats: [],
    orderStats: [],
  } as IOverviewStatus);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      const res = await axios.post('get-overview-stats');
      setStatus(res.data);
    };
    fetchTotalUsers();
  }, []);

  return (
    <>
      <Head>
        <title>Steamupgrade Admin Dashboard</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <AppWidgetSummary
              title="Total Users"
              percent={2.6}
              total={status.totalUsers}
              chart={{
                colors: [theme.palette.primary.main],
                series: status.userStats?.map((user: { _id: string, count: number }) => user.count),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>

            <EcommerceWidgetSummary
              title="Total Orders"
              percent={2.6}
              total={status.totalOrders}
              chart={{
                colors: [theme.palette.primary.main],
                series: status.orderStats?.map((order: { _id: string, count: number }) => order.count),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Total Reward claim Requests"
              total={status.totalRewardRequests}
              icon={<BookingIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title="Pending" total={status.totalPendingRewards} icon={<CheckInIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Accepted"
              total={status.totalAcceptedRewards}
              icon={<CheckOutIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={8} xl={9}>
            <AnalyticsWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chart={{
                labels: status.visitStats?.map((visit: { _id: string, totalSales: number }) => `${visit._id}-01`),
                series: [
                  {
                    name: 'visiters',
                    type: 'area',
                    fill: 'gradient',
                    data: status.visitStats?.map((visit: { _id: string, totalSales: number }) => visit.totalSales),
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4} xl={3}>
            <BookingRoomAvailable
              title="Items Available"
              chart={{
                series: [
                  { label: 'Sold out', value: 120 },
                  { label: 'Available', value: 66 },
                ],
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <EcommerceYearlySales
              title="Yearly Sales"
              subheader="(+43%) than last year"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                series: [
                  {
                    year: '2025',
                    data: [
                      {
                        name: 'Total Income',
                        data: Array(parseInt(status.monthlySales[0]?._id.split("-")[status.monthlySales[0]?._id.split("-").length - 1] || '0', 10)).fill(0).concat(status.monthlySales?.map((sale) => sale.totalSales) || [0, 0])
                      }
                    ],
                  },
                ],
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <EcommerceBestSalesman
              title="Top Orders"
              tableData={status.bestCustomers}
              tableLabels={[
                { id: 'customer', label: 'Customer' },
                { id: 'level', label: 'Level' },
                { id: 'total', label: 'Total Spent' },
                { id: 'rank', label: 'Rank', align: 'right' },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <BookingDetails
              title="Reward Requests Awaiting Acceptance"
              tableData={status.rewardRequests}
              tableLabels={[
                { id: 'user', label: 'User', align: 'left' },
                { id: 'amount', label: 'Amount' },
                { id: 'network', label: 'Network' },
                { id: 'address', label: 'Address' },
                { id: 'date', label: 'Date' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
