import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import { AffiliateTableRow } from '../../../sections/@dashboard/affiliate/list';
import axios from '../../../utils/axios';

const TABLE_HEAD = [
  { id: 'fullName', label: 'Full Name', align: 'left' },
  { id: 'affiliateCode', label: 'Affiliate Code', align: 'left' },
  { id: 'buyers', label: 'Buyers', align: 'right' },
  { id: 'referrals', label: 'Referrals', align: 'right' },
  { id: 'totalProfit', label: 'Total Profit', align: 'right' },
  { id: '', align: 'right' },
];

AffiliateListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function AffiliateListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

  const [users, setUsers] = useState<IAffiliate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const fetchAffiliate = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await axios.post('get-affiliate-list', {
        page,
        limit: rowsPerPage,
      });
      if (res.status === 200) {
        setUsers(res.data.affiliateData);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch affiliate list');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliate();
  }, []);

  const denseHeight = dense ? 52 : 72;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleDeleteRow = async (id: string) => {
    try {
      await axios.post(`delete-user/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      setSelected([]);
      
      if (page > 0 && users.length - 1 <= page * rowsPerPage) {
        setPage(page - 1);
      }
    } catch (err) {
      console.error(err);
      // Add error handling UI feedback here
    }
  };

  const handleDeleteRows = async (selectedIds: string[]) => {
    try {
      await Promise.all(selectedIds.map((id) => axios.post(`delete-user/${id}`)));
      setUsers((prevUsers) => prevUsers.filter((user) => !selectedIds.includes(user._id)));
      setSelected([]);
      handleCloseConfirm();
      
      if (page > 0 && users.length - selectedIds.length <= page * rowsPerPage) {
        setPage(page - 1);
      }
    } catch (err) {
      console.error(err);
      // Add error handling UI feedback here
    }
  };

  // Calculate dataInPage for proper pagination

  const handleEditRow = (id: string) => {
    // push(PATH_DASHBOARD.affiliate.edit(paramCase(id)));
  };

  return (
    <>
      <Head>
        <title> Affiliate: List | Steamupgrade Admin Dashboard</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Affiliate List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Affiliate', href: PATH_DASHBOARD.affiliate.root },
            { name: 'List' },
          ]}
          // action={
          //   <Button
          //     component={NextLink}
          //     href={PATH_DASHBOARD.user.new}
          //     variant="contained"
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     New User
          //   </Button>
          // }
        />

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={users.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  users.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      users.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {users
                    .map((row) => (
                      <AffiliateTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, users.length)}
                  />

                  <TableNoData isNotFound={!isLoading && users.length === 0} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={Math.ceil(users.length / rowsPerPage)}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteRows(selected)}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
