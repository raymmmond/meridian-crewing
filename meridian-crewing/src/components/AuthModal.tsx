import React, { useState } from 'react'
import styled from 'styled-components'
import theme from '../theme'
import { UserRole } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 10, 16, 0.72);
  overflow-y: auto;
  padding: 40px 24px;
  z-index: 100;
`

const Panel = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  background: ${theme.color.navy700};
  border: 1px solid ${theme.color.steel};
  padding: 32px;
`

const Eyebrow = styled.div`
  font-family: ${theme.font.mono};
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.color.rustLight};
  margin-bottom: 10px;
`

const Title = styled.h3`
  font-size: 1.4rem;
  color: ${theme.color.white};
  margin-bottom: 24px;
`

const Field = styled.label`
  display: block;
  margin-bottom: 16px;
  font-family: ${theme.font.mono};
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.color.steelLight};
`

const Input = styled.input`
  display: block;
  width: 100%;
  margin-top: 8px;
  background: ${theme.color.navy900};
  border: 1px solid ${theme.color.steel};
  color: ${theme.color.paper};
  padding: 11px 12px;
  font-family: ${theme.font.body};
  font-size: 0.92rem;

  &:focus {
    border-color: ${theme.color.brass};
  }
`

const RoleToggle = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`

const RoleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 11px;
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: 1px solid
    ${(p) => (p.$active ? theme.color.brass : theme.color.steel)};
  background: ${(p) => (p.$active ? theme.color.brass : 'transparent')};
  color: ${(p) => (p.$active ? theme.color.navy900 : theme.color.steelLight)};
`

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`

const Submit = styled.button`
  flex: 1;
  background: ${theme.color.rust};
  color: ${theme.color.white};
  border: none;
  padding: 13px;
  font-family: ${theme.font.mono};
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  &:hover {
    background: ${theme.color.rustLight};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Cancel = styled.button`
  background: transparent;
  border: 1px solid ${theme.color.steel};
  color: ${theme.color.steelLight};
  padding: 13px 18px;
  font-family: ${theme.font.mono};
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

const ErrorText = styled.div`
  color: ${theme.color.rustLight};
  font-family: ${theme.font.mono};
  font-size: 0.76rem;
  margin: -6px 0 16px;
`

const SwitchLine = styled.div`
  margin-top: 18px;
  font-family: ${theme.font.mono};
  font-size: 0.78rem;
  color: ${theme.color.steelLight};

  button {
    color: ${theme.color.brass};
    text-decoration: underline;
    margin-left: 6px;
  }
`

const ForgotLink = styled.button`
  display: block;
  margin: -8px 0 16px auto;
  background: none;
  border: none;
  padding: 0;
  font-family: ${theme.font.mono};
  font-size: 0.74rem;
  color: ${theme.color.steelLight};
  text-decoration: underline;
`

const Confirm = styled.p`
  font-family: ${theme.font.mono};
  font-size: 0.88rem;
  color: ${theme.color.paper};
  line-height: 1.7;
`

interface Props {
  onClose: () => void
}

type Mode = 'login' | 'signup' | 'forgot'

const AuthModal: React.FC<Props> = ({ onClose }) => {
  const { login, signup, requestPasswordReset } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('SEAFARER')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'forgot') {
      if (!email.trim()) {
        setError('Enter your email first.')
        return
      }
      setSubmitting(true)
      try {
        await requestPasswordReset(email.trim())
        setResetSent(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      } finally {
        setSubmitting(false)
      }
      return
    }

    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }
    if (mode === 'signup' && password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'signup') {
        await signup(email.trim(), password, role)
      } else {
        await login(email.trim(), password)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
    setResetSent(false)
  }

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        {mode === 'forgot' ? (
          resetSent ? (
            <>
              <Eyebrow>Check your email</Eyebrow>
              <Title>Reset link sent</Title>
              <Confirm>
                If an account exists for <strong>{email.trim()}</strong>,
                a password reset link is on its way. Click it to set a new
                password — the link will bring you back here.
              </Confirm>
              <Actions>
                <Submit type="button" onClick={onClose}>
                  Close
                </Submit>
              </Actions>
            </>
          ) : (
            <>
              <Eyebrow>Forgot password</Eyebrow>
              <Title>Reset your password</Title>
              {error && <ErrorText>{error}</ErrorText>}
              <form onSubmit={handleSubmit}>
                <Field>
                  Email
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                  />
                </Field>
                <Actions>
                  <Submit type="submit" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send reset link'}
                  </Submit>
                  <Cancel type="button" onClick={() => switchMode('login')}>
                    Back
                  </Cancel>
                </Actions>
              </form>
            </>
          )
        ) : (
          <>
            <Eyebrow>
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </Eyebrow>
            <Title>{mode === 'login' ? 'Log in' : 'Sign up'}</Title>
            {error && <ErrorText>{error}</ErrorText>}
            <form onSubmit={handleSubmit}>
              <Field>
                Email
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoFocus
                />
              </Field>
              <Field>
                Password
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === 'signup' ? 'At least 8 characters' : '••••••••'
                  }
                />
              </Field>
              {mode === 'login' && (
                <ForgotLink type="button" onClick={() => switchMode('forgot')}>
                  Forgot password?
                </ForgotLink>
              )}
              {mode === 'signup' && (
                <Field>
                  I am a
                  <RoleToggle>
                    <RoleButton
                      type="button"
                      $active={role === 'SEAFARER'}
                      onClick={() => setRole('SEAFARER')}
                    >
                      Seafarer
                    </RoleButton>
                    <RoleButton
                      type="button"
                      $active={role === 'EMPLOYER'}
                      onClick={() => setRole('EMPLOYER')}
                    >
                      Employer
                    </RoleButton>
                  </RoleToggle>
                </Field>
              )}
              <Actions>
                <Submit type="submit" disabled={submitting}>
                  {submitting
                    ? mode === 'login'
                      ? 'Logging in…'
                      : 'Creating account…'
                    : mode === 'login'
                      ? 'Log in'
                      : 'Create account'}
                </Submit>
                <Cancel type="button" onClick={onClose}>
                  Cancel
                </Cancel>
              </Actions>
            </form>
            <SwitchLine>
              {mode === 'login' ? 'No account yet?' : 'Already have an account?'}
              <button
                type="button"
                onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </SwitchLine>
          </>
        )}
      </Panel>
    </Overlay>
  )
}

export default AuthModal
