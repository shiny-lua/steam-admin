// @mui
import { Box, BoxProps } from '@mui/material';
// @type
import { IProduct } from '../../../../@types/product';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
//
import ShopProductCard from './ShopProductCard';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  products: IProduct[];
}

export default function ShopProductList({ products, ...other }: Props) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
      {...other}
    >
      {products.map((product, index) => (
        <ShopProductCard key={product.id} product={product} />
      ))}
    </Box>
  );
}
