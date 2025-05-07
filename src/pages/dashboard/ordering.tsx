// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container } from '@mui/material';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// _mock_
import { _bookings, _bookingNew, _bookingsOverview, _bookingReview } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  BookingDetails,
  BookingBookedRoom,
  BookingTotalIncomes,
  BookingRoomAvailable,
  BookingNewestBooking,
  BookingWidgetSummary,
  BookingCheckInWidgets,
  BookingCustomerReviews,
  BookingReservationStats,
} from '../../sections/@dashboard/general/booking';
// assets
import {
  BookingIllustration,
  CheckInIllustration,
  CheckOutIllustration,
} from '../../assets/illustrations';

// ----------------------------------------------------------------------

GeneralBookingPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------
export default function GeneralBookingPage() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Ordering | Steamupgrade Admin Dashboard</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <BookingTotalIncomes
                  total={18765}
                  percent={2.6}
                  chart={{
                    series: [111, 136, 76, 108, 74, 54, 57, 84],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <BookingBookedRoom title="Ordered Room" data={_bookingsOverview} />
              </Grid>

              <Grid item xs={12} md={12}>
                <BookingCheckInWidgets
                  chart={{
                    colors: [theme.palette.warning.main],
                    series: [
                      { label: 'Check In', percent: 72, total: 38566 },
                      { label: 'Check Out', percent: 64, total: 18472 },
                    ],
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
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
            <BookingDetails
              title="Ordering Details"
              tableData={_bookings}
              tableLabels={[
                { id: 'customer', label: 'Customer' },
                { id: 'checkIn', label: 'Check In' },
                { id: 'checkOut', label: 'Check Out' },
                { id: 'status', label: 'Status' },
                { id: 'current_level', label: 'Current Level' },
                { id: 'dream_level', label: 'Dream Level' },
                { id: '' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
