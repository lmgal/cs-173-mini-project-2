import { useState } from 'react'
import { useWallet } from './utils/useWallet'
import { useTezos } from './utils/useTezos'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Grid, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'

import Navbar from './components/Navbar'
import TabPanel from './components/TabPanel'

function App() {
  const useWalletReturn = useWallet()
  const { wallet, connectWallet, disconnectWallet, getActiveAccount } = useWalletReturn
  const { tezos } = useTezos(wallet)
  // States
  const [tabValue, setTabValue] = useState(0)
  const [depositAmount, setDepositAmount] = useState('')

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const depositOwner = async () => {
    try {
      const contract = await tezos?.wallet.at(process.env.CONTRACT_ADDRESS as string)
      const op = await contract?.methods.addBalanceOwner()
        .send({
          amount: Number.parseFloat(depositAmount)
        })

      await op?.confirmation(1)
    } catch (err){
      throw err
    }
  }

  return (
    <>
      <Navbar useWallet={useWalletReturn} />
      <Grid container p={10}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Deposit" {...a11yProps(0)} />
            <Tab label="Claim" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Typography variant='h6'>Deposit</Typography>
          <TextField 
            value={depositAmount} 
            onChange={(e) => setDepositAmount(e.target.value)} 
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            label="Amount"
          />

        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Typography variant='h6'>Claim</Typography>

        </TabPanel>
      </Grid>
    </>
  )
}

export default App
