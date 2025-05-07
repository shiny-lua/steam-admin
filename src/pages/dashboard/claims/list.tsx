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
import { ClaimTableRow } from '../../../sections/@dashboard/claims/list';
import axios from '../../../utils/axios';

const TABLE_HEAD = [
  { id: 'claimId', label: 'Claim ID', align: 'left' },
  { id: 'fullName', label: 'Full Name', align: 'left' },
  { id: 'amount', label: 'Profit Amount', align: 'right' },
  { id: 'address', label: 'Wallet Address', align: 'center' },
  { id: 'network', label: 'Network', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'updatedAt', label: 'Date', align: 'right' },
  { id: '', align: 'right' },
];

ClaimListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function ClaimListPage() {
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

  const [claims, setClaims] = useState<IClaim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const fetchAffiliate = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await axios.post('get-claim-list', {
        page,
        limit: rowsPerPage,
      });
      if (res.status === 200) {
        setClaims(res.data.claimsData);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch claim list');
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
      setClaims((prevClaims) => prevClaims.filter((claim) => claim.id !== id));
      setSelected([]);
      
      if (page > 0 && claims.length - 1 <= page * rowsPerPage) {
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
      setClaims((prevClaims) => prevClaims.filter((claim) => !selectedIds.includes(claim.id)));
      setSelected([]);
      handleCloseConfirm();
      
      if (page > 0 && claims.length - selectedIds.length <= page * rowsPerPage) {
        setPage(page - 1);
      }
    } catch (err) {
      console.error(err);
      // Add error handling UI feedback here
    }
  };

  // Calculate dataInPage for proper pagination

  const handleSend = (id: string) => {
    push(PATH_DASHBOARD.claims.send(id));
  };

  return (
    <>
      <Head>
        <title> Claims: List | Steamupgrade Admin Dashboard</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Claims List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Claims', href: PATH_DASHBOARD.claims.root },
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
              rowCount={claims.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  claims.map((row) => row.id)
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
                  rowCount={claims.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                        claims.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {claims
                    .map((row) => (
                      <ClaimTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleSend(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, claims.length)}
                  />

                  <TableNoData isNotFound={!isLoading && claims.length === 0} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={Math.ceil(claims.length / rowsPerPage)}
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
