import { useState } from 'react'
import { useWallet } from './utils/useWallet'
import { useTezos } from './utils/useTezos'

import { Alert, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Snackbar, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import Navbar from './components/Navbar'
import TabPanel from './components/TabPanel'

function App() {
  const useWalletReturn = useWallet()
  const { wallet } = useWalletReturn
  const { tezos } = useTezos(wallet)
  // States
  const [tabValue, setTabValue] = useState(0)
  const [depositAmount, setDepositAmount] = useState('')
  const [isOwner, setIsOwner] = useState(true)
  const [secret, setSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSnackOpen, setIsSnackOpen] = useState(false)
  const [isSnackSuccess, setIsSnackSuccess] = useState(true)
  const [snackMsg, setSnackMsg] = useState('')

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const depositOwner = async () => {
    try {
      setLoading(true)
      const contract = await tezos?.wallet.at(import.meta.env.CONTRACT_ADDRESS as string)
      const op = await contract?.methods.addBalanceOwner()
        .send({
          amount: Number.parseFloat(depositAmount),
          mutez: false
        })

      await op?.confirmation(1)
      setSnackMsg('Deposit successful')
      setIsSnackSuccess(true)
    } catch (err) {
      // @ts-ignore
      setSnackMsg('Deposit failed: ' + err.message)
      setIsSnackSuccess(false)
    } finally {
      setLoading(false)
      setIsSnackOpen(true)
    }
  }

  const depositCounterParty = async () => {
    try {
      const contract = await tezos?.wallet.at(import.meta.env.CONTRACT_ADDRESS as string)
      const op = await contract?.methods.addBalanceCounterparty()
        .send({
          amount: Number.parseFloat(depositAmount),
          mutez: false
        })

      await op?.confirmation(1)
      setSnackMsg('Deposit successful')
      setIsSnackSuccess(true)
    } catch (err) {
      // @ts-ignore
      setSnackMsg('Deposit failed: ' + err.message)
      setIsSnackSuccess(false)
    } finally {
      setLoading(false)
      setIsSnackOpen(true)
    }
  }

  const claimOwner = async () => {
    try {
      const contract = await tezos?.wallet.at(import.meta.env.CONTRACT_ADDRESS as string)
      const op = await contract?.methods.claimOwner()
        .send()

      await op?.confirmation(1)
      setSnackMsg('Claim successful')
      setIsSnackSuccess(true)
    } catch (err) {
      // @ts-ignore
      setSnackMsg('Claim failed: ' + err.message)
      setIsSnackSuccess(false)
    } finally {
      setLoading(false)
      setIsSnackOpen(true)
    }
  }

  const claimCounterParty = async () => {
    try {
      const contract = await tezos?.wallet.at(import.meta.env.CONTRACT_ADDRESS as string)
      const op = await contract?.methods.claimCounterparty({
        secret: secret
      })
        .send()

      await op?.confirmation(1)
      setSnackMsg('Claim successful')
      setIsSnackSuccess(true)
    } catch (err) {
      // @ts-ignore
      setSnackMsg('Claim failed: ' + err.message)
      setIsSnackSuccess(false)
    } finally {
      setLoading(false)
      setIsSnackOpen(true)
    }
  }

  return (
    <>
      <Snackbar open={isSnackOpen} autoHideDuration={6000} onClose={() => setIsSnackOpen(false)}>
        <Alert 
          onClose={() => setIsSnackOpen(false)} 
          severity={isSnackSuccess ? "success" : "error"} 
          sx={{ width: '100%' }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
      <Navbar useWallet={useWalletReturn} />
      <Grid container p={10}>
        <Grid xs={12} p={1}>
          <Typography variant='h3'>Escrow Contract</Typography>
        </Grid>
        <Grid xs={12} p={1}>
          <FormControl>
            <FormLabel>Identity</FormLabel>
            <RadioGroup
              value={isOwner}
              onChange={(e) => setIsOwner(e.target.value === 'true')}
            >
              <FormControlLabel value={'true'} control={<Radio />} label="Owner" />
              <FormControlLabel value={'false'} control={<Radio />} label="Counterparty" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid xs={12} p={1}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Deposit" {...a11yProps(0)} />
              <Tab label="Claim" {...a11yProps(1)} />
            </Tabs>
          </Box>
        </Grid>
        <TabPanel value={tabValue} index={0}>
          <Grid container>
            <Grid xs={12} p={1}>
              <Typography variant='h6'>Deposit</Typography>
            </Grid>
            <Grid xs={12} p={1}>
              <TextField
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]+(\.[0-9]*)' }}
                label="Amount"
              />
            </Grid>
            <Grid xs={12} p={1}>
              <Button
                variant='contained'
                disabled={loading}
                onClick={isOwner ? depositOwner : depositCounterParty}
              >
                Deposit
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Typography variant='h6'>Claim</Typography>
          <Grid container>
            {!isOwner && <Grid xs={12} p={1}>
              <TextField
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                label="Secret"
              />
            </Grid>}
            <Grid xs={12} p={1}>
              <Button
                variant='contained'
                disabled={loading}
                onClick={isOwner ? claimOwner : claimCounterParty}>
                Claim
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Grid>
    </>
  )
}

export default App
