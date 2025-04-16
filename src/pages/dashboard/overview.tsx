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
  EcommerceNewProducts,
  EcommerceYearlySales,
  EcommerceBestSalesman,
  EcommerceSaleByGender,
  EcommerceWidgetSummary,
  EcommerceSalesOverview,
  EcommerceLatestProducts,
  EcommerceCurrentBalance,
} from '../../sections/@dashboard/general/overview';
import { AppWelcome, AppWidgetSummary } from '../../sections/@dashboard/general/app';
// assets
import { MotivationIllustration } from '../../assets/illustrations';

// ----------------------------------------------------------------------

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
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AppWidgetSummary
              title="Total invited Users"
              percent={0.2}
              total={4876}
              chart={{
                colors: [theme.palette.info.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>

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
            <EcommerceWidgetSummary
              title="Total Balance"
              percent={-0.1}
              total={18765}
              chart={{
                colors: [theme.palette.info.main],
                series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Sales Profit"
              percent={0.6}
              total={4876}
              chart={{
                colors: [theme.palette.warning.main],
                series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
              }}
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

          <Grid item xs={12} md={6} lg={8}>
            <EcommerceSalesOverview title="Sales Overview" data={_ecommerceSalesOverview} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <EcommerceCurrentBalance
              title="Current Balance"
              currentBalance={187650}
              sentAmount={25500}
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
        </Grid>
      </Container>
    </>
  );
}
