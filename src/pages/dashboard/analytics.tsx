// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// _mock_
import { _analyticPost, _analyticOrderTimeline, _analyticTraffic } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AnalyticsTasks,
  AnalyticsNewsUpdate,
  AnalyticsOrderTimeline,
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsTrafficBySite,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
} from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

GeneralAnalyticsPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function GeneralAnalyticsPage() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title>Analytics | Steamupgrade Admin Dashboard</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="Weekly Sales"
              total={714000}
              icon="ant-design:android-filled"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="New Users"
              total={1352831}
              color="info"
              icon="ant-design:apple-filled"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="Item Orders"
              total={1723315}
              color="warning"
              icon="ant-design:windows-filled"
            />
          </Grid>

          <Grid item xs={12}>
            <AnalyticsWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chart={{
                labels: [
                  '01/01/2025',
                  '02/01/2025',
                  '03/01/2025',
                  '04/01/2025',
                  '05/01/2025',
                  '06/01/2025',
                  '07/01/2025',
                  '08/01/2025',
                  '09/01/2025',
                  '10/01/2025',
                  '11/01/2025',
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

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chart={{
                series: [
                  { label: 'Italy', value: 400 },
                  { label: 'Japan', value: 430 },
                  { label: 'China', value: 448 },
                  { label: 'Canada', value: 470 },
                  { label: 'France', value: 540 },
                  { label: 'Germany', value: 580 },
                  { label: 'South Korea', value: 690 },
                  { label: 'Netherlands', value: 1100 },
                  { label: 'United States', value: 1200 },
                  { label: 'United Kingdom', value: 1380 },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
