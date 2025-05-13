// @mui
import {
  Box,
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  CardProps,
  CardHeader,
  Typography,
  TableContainer,
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/label';
import Image from '../../../../components/image';
import Scrollbar from '../../../../components/scrollbar';
import { TableHeadCustom } from '../../../../components/table';

// ----------------------------------------------------------------------

type RowProps = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  category: string;
  total: number;
  rank: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: IBestCustomer[];
  tableLabels: any;
}

export default function EcommerceBestSalesman({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row, index) => (
                <EcommerceBestSalesmanRow key={index} index={index} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

function EcommerceBestSalesmanRow({ row, index }: { row: IBestCustomer, index: number }) {
  return (
    <TableRow>
      <TableCell>
        <Stack direction="row" alignItems="center">
          <Avatar alt={row.fullName} src={row.avatar} />

          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2"> {row.fullName} </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {row._id}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>{row.level}</TableCell>
      <TableCell>$ {row.totalSpent || '0'}</TableCell>

      <TableCell align="right">
        <Label
          variant="soft"
          color={
            (index === 0 && 'primary') ||
            (index === 1 && 'info') ||
            (index === 2 && 'success') ||
            (index === 3 && 'warning') ||
            'error'
          }
        >
          {index + 1}
        </Label>
      </TableCell>
    </TableRow>
  );
}
