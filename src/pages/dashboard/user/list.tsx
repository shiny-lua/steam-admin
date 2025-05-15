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
  TableCell,
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
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import { UserTableRow } from '../../../sections/@dashboard/user/list';
import axios from '../../../utils/axios';
import { UserType } from 'src/@types/user';

const TABLE_HEAD = [
  { id: 'fullName', label: 'Full Name', align: 'left' },
  { id: 'level', label: 'Level', align: 'left' },
  { id: 'tradeLink', label: 'Trade Link', align: 'left' },
  { id: 'balance', label: 'Balance', align: 'left' },
  { id: 'ip', label: 'IP', align: 'center' },
  { id: 'deviceID', label: 'Device ID', align: 'center' },
  { id: 'joinedDate', label: 'Joined Date', align: 'center' },
  { id: '' },
];

UserListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function UserListPage() {
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

  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await axios.post('get-users', {
        page,
        limit: rowsPerPage,
      });

      if (res.status === 200) {
        setUsers(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
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
      setUsers((prevUsers) => prevUsers.filter((user) => !selectedIds.includes(user.id)));
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
    push(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  return (
    <>
      <Head>
        <title> User: List | Steamupgrade Admin Dashboard</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
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
                  users.map((row) => row.id)
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
                      users.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {users
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
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
