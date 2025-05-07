// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Button } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// _mock_
import {
  _ecommerceNewProducts,
  _ecommerceSalesOverview,
  _ecommerceBestSalesman,
  _ecommerceLatestProducts,
} from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  EcommerceYearlySales,
  EcommerceBestSalesman,
  EcommerceSaleByGender,
  EcommerceWidgetSummary,
  EcommerceSalesOverview,
  EcommerceCurrentBalance,
} from '../../sections/@dashboard/general/overview';
import { AppWidgetSummary } from '../../sections/@dashboard/general/app';
import { AnalyticsWebsiteVisits } from 'src/sections/@dashboard/general/analytics';
import { BookingWidgetSummary } from 'src/sections/@dashboard/general/booking';
import { BookingIllustration, CheckInIllustration, CheckOutIllustration } from 'src/assets/illustrations';


GeneralEcommercePage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function GeneralEcommercePage() {
  const { user } = useAuthContext();

  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

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
              total={18765}
              chart={{
                colors: [theme.palette.primary.main],
                series: [100],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>

            <EcommerceWidgetSummary
              title="Total Orders"
              percent={2.6}
              total={765}
              chart={{
                colors: [theme.palette.primary.main],
                series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Total Ordering"
              total={714000}
              icon={<BookingIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title="Check In" total={311000} icon={<CheckInIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Check Out"
              total={124000}
              icon={<CheckOutIllustration />}
            />
          </Grid>

          <Grid item xs={12}>
            <AnalyticsWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chart={{
                labels: [
                  '01-1-2025',
                  '02-1-2025',
                  '03-1-2025',
                  '04-1-2025',
                  '05-1-2025',
                  '06-1-2025',
                  '07-1-2025',
                  '08-1-2025',
                  '09-1-2025',
                  '10-1-2025',
                  '11-1-2025',
                ],
                series: [
                  {
                    name: 'visiters',
                    type: 'area',
                    fill: 'gradient',
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <EcommerceBestSalesman
              title="Best Customers"
              tableData={_ecommerceBestSalesman}
              tableLabels={[
                { id: 'customer', label: 'Customer' },
                { id: 'level', label: 'Level' },
                { id: 'total', label: 'Total' },
                { id: 'rank', label: 'Rank', align: 'right' },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <EcommerceSaleByGender
              title="Sale By Payment"
              total={2324}
              chart={{
                series: [
                  { label: 'Crypto', value: 44 },
                  { label: 'Card', value: 75 },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <EcommerceYearlySales
              title="Yearly Sales"
              subheader="(+43%) than last year"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                series: [
                  {
                    year: '2024',
                    data: [
                      { name: 'Total Income', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
                    ],
                  },
                  {
                    year: '2025',
                    data: [
                      { name: 'Total Income', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                    ],
                  },
                ],
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
