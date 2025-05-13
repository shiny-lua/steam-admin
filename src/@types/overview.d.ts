interface IBestCustomer {
  _id:           string
  fullName:     string
  avatar:       string
  level:        number
  totalSpent:   number
}

interface IYearlySales {
  _id:          string
  totalSales:   number
}

interface IMonthlySales {
  _id:          string
  totalSales:   number
} 

interface IRewardRequest {
  _id:          string
  id:           string
  userId:       string
  amount:       number
  address:      string
  network:      string
  status:       string
  createdAt:    number
  updatedAt:    number
  fullName:     string
  avatar:       string
}

interface IStat {
  _id:          string
  count:        number
}

declare interface IOverviewStatus {
  totalUsers:                number
  totalOrders:               number
  totalRewardRequests:       number
  totalPendingRewards:       number
  totalAcceptedRewards:      number
  visitStats:                {_id: string, totalSales: number}[]
  bestCustomers:             IBestCustomer[]
  yearlySales:               IYearlySales[]
  monthlySales:              IMonthlySales[]
  rewardRequests:            IRewardRequest[]
  userStats:                 IStat[]
  orderStats:                IStat[]
}