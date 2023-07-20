import { css } from '../../../styled-system/css'

export const headerContainer = css({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'calc(10px + 2vmin)',
})

export const liftIntroContainer = css({
  color: '#125ec8',
  marginTop: '12px',
  width: '60%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  animation: '2s easeOut 0s 1 fadeIn',
})

export const loginLiftTitle = css({
  marginBottom: '16px',
  fontWeight: '600',
  fontSize: '48px',
})

export const loginLiftMotto = css({
  fontSize: '20px',
  margin: '6px 0',
})
