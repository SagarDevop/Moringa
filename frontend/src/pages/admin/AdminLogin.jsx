import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../context/ProductContext';
import Logo from '../../components/Logo';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockUntil, setLockUntil] = useState(0);
  const [countdown, setCountdown] = useState('');

  // Forgot Password States
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = enter email, 2 = enter OTP and new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Check logged in status on mount
  useEffect(() => {
    const admin = localStorage.getItem('bandamart_admin');
    if (admin) {
      try {
        const data = JSON.parse(admin);
        if (data.loggedIn) {
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (err) {}
    }
  }, [navigate]);

  // 2. Load lockout from localStorage on mount
  useEffect(() => {
    const savedLock = localStorage.getItem('bandamart_admin_lockout');
    if (savedLock) {
      const time = parseInt(savedLock, 10);
      if (time > Date.now()) {
        setLockUntil(time);
      } else {
        localStorage.removeItem('bandamart_admin_lockout');
      }
    }
  }, []);

  // 3. Countdown timer logic
  useEffect(() => {
    if (!lockUntil) {
      setCountdown('');
      return;
    }

    const interval = setInterval(() => {
      const remaining = lockUntil - Date.now();
      if (remaining <= 0) {
        setLockUntil(0);
        localStorage.removeItem('bandamart_admin_lockout');
        clearInterval(interval);
      } else {
        const totalSecs = Math.ceil(remaining / 1000);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        setCountdown(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockUntil]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Check client-side lockout
    if (lockUntil && lockUntil > Date.now()) {
      setError(`Too many failed attempts. Locked out.`);
      return;
    }

    if (!form.username || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        localStorage.setItem('bandamart_admin', JSON.stringify({ loggedIn: true, timestamp: Date.now() }));
        navigate('/admin/dashboard');
      } else {
        const data = await res.json();
        
        // Handle 429 Lockout response
        if (res.status === 429 && data.lockUntil) {
          const lockTime = parseInt(data.lockUntil, 10);
          setLockUntil(lockTime);
          localStorage.setItem('bandamart_admin_lockout', lockTime.toString());
        }
        
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to backend server. Please verify it is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!forgotEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Reset code generated.');
        setForgotStep(2);
      } else {
        setError(data.error || 'Failed to request reset code');
      }
    } catch (err) {
      setError('Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otp) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Verification code verified.');
        setForgotStep(3);
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (err) {
      setError('Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otp || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otp,
          newPassword: newPassword
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Password reset successfully! You can now log in.');
        setForgotMode(false);
        setForgotStep(1);
        setForgotEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--container-padding)',
      background: 'var(--background)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        animation: 'fadeInScale 0.5s ease forwards',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <Logo type="full" size={72} />
          <h3 className="text-title-md" style={{ color: 'var(--primary)', margin: '16px 0 4px' }}>
            Admin Control Panel
          </h3>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
            Sign in to manage your store
          </p>
        </div>

        {/* Error Message */}
        {error && lockUntil <= Date.now() && (
          <div style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--error-container)',
            color: 'var(--on-error-container)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 'var(--space-lg)',
            display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
            animation: 'fadeInUp 0.3s ease',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMsg && (
          <div style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--primary-container)',
            color: 'var(--on-primary-container)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 'var(--space-lg)',
            display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
            animation: 'fadeInUp 0.3s ease',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
            {successMsg}
          </div>
        )}

        {/* Form Container */}
        {!forgotMode ? (
          /* Sign In Form */
          <form onSubmit={handleLogin} style={{
            background: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-xl)',
            boxShadow: 'var(--shadow-xl)',
          }}>
            {lockUntil > Date.now() && (
              <div style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--error-container)',
                color: 'var(--on-error-container)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 'var(--space-lg)',
                display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                animation: 'fadeInUp 0.3s ease',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock_clock</span>
                Locked out. Try again in {countdown || '1:00:00'}
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label className="text-label-sm" style={{
                display: 'block', color: 'var(--on-surface-variant)',
                marginBottom: 'var(--space-xs)', marginLeft: 4,
              }}>Username or Email</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 'var(--space-md)', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>person</span>
                </div>
                <input
                  type="text"
                  disabled={loading || lockUntil > Date.now()}
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="Enter username or email"
                  autoComplete="username"
                  style={{
                    width: '100%', padding: 'var(--space-md)', paddingLeft: 48,
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: 16, color: 'var(--on-surface)',
                    opacity: (loading || lockUntil > Date.now()) ? 0.6 : 1,
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label className="text-label-sm" style={{
                display: 'block', color: 'var(--on-surface-variant)',
                marginBottom: 'var(--space-xs)', marginLeft: 4,
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 'var(--space-md)', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>lock</span>
                </div>
                <input
                  type="password"
                  disabled={loading || lockUntil > Date.now()}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: 'var(--space-md)', paddingLeft: 48,
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: 16, color: 'var(--on-surface)',
                    opacity: (loading || lockUntil > Date.now()) ? 0.6 : 1,
                  }}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'right', marginBottom: 'var(--space-lg)' }}>
              <button
                type="button"
                onClick={() => { setForgotMode(true); setForgotStep(1); setError(''); setSuccessMsg(''); }}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || lockUntil > Date.now()}
              style={{
                width: '100%', padding: 'var(--space-md)',
                background: 'var(--primary)', color: 'var(--on-primary)',
                borderRadius: 'var(--radius-xl)',
                fontWeight: 700, fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 'var(--space-sm)',
                opacity: (loading || lockUntil > Date.now()) ? 0.6 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : 'Sign In'}
            </button>
          </form>
        ) : forgotStep === 1 ? (
          /* Forgot Password Step 1: Request OTP */
          <form onSubmit={handleForgotSubmit} style={{
            background: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-xl)',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <h4 style={{ margin: '0 0 16px', color: 'var(--on-surface)', fontSize: 16, fontWeight: 700 }}>
              Forgot Password
            </h4>
            <p style={{ fontSize: 13, color: 'var(--outline)', marginBottom: 20, lineHeight: 1.4 }}>
              Enter the admin email address associated with your account to receive a 6-digit reset code.
            </p>

            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label className="text-label-sm" style={{
                display: 'block', color: 'var(--on-surface-variant)',
                marginBottom: 'var(--space-xs)', marginLeft: 4,
              }}>Admin Email</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 'var(--space-md)', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>mail</span>
                </div>
                <input
                  type="email"
                  disabled={loading}
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="e.g. admin@example.com"
                  style={{
                    width: '100%', padding: 'var(--space-md)', paddingLeft: 48,
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: 16, color: 'var(--on-surface)',
                    opacity: loading ? 0.6 : 1,
                  }}
                />
              </div>
              <span style={{ fontSize: 10, color: 'var(--primary)', marginTop: 8, display: 'block', fontWeight: 600 }}>
                💡 Tip: The verification OTP will be sent to your email (or printed in the backend console if SMTP is not configured).
              </span>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                type="button"
                onClick={() => { setForgotMode(false); setError(''); setSuccessMsg(''); }}
                style={{
                  flex: 1, padding: 'var(--space-md)',
                  background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)',
                  borderRadius: 'var(--radius-xl)',
                  fontWeight: 700, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 2, padding: 'var(--space-md)',
                  background: 'var(--primary)', color: 'var(--on-primary)',
                  borderRadius: 'var(--radius-xl)',
                  fontWeight: 700, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">sync</span>
                ) : 'Send Reset Code'}
              </button>
            </div>
          </form>
        ) : forgotStep === 2 ? (
          /* Forgot Password Step 2: Enter OTP */
          <form onSubmit={handleVerifyOtpSubmit} style={{
            background: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-xl)',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <h4 style={{ margin: '0 0 16px', color: 'var(--on-surface)', fontSize: 16, fontWeight: 700 }}>
              Verify OTP
            </h4>
            <p style={{ fontSize: 13, color: 'var(--outline)', marginBottom: 20, lineHeight: 1.4 }}>
              Enter the 6-digit verification code sent to your email (or logged in the backend console).
            </p>

            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label className="text-label-sm" style={{
                display: 'block', color: 'var(--on-surface-variant)',
                marginBottom: 'var(--space-xs)', marginLeft: 4,
              }}>Verification Code (OTP)</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 'var(--space-md)', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>key</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  disabled={loading}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  style={{
                    width: '100%', padding: 'var(--space-md)', paddingLeft: 48,
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: 16, color: 'var(--on-surface)',
                    opacity: loading ? 0.6 : 1,
                    letterSpacing: '0.2em',
                    fontWeight: 800,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                type="button"
                onClick={() => { setForgotStep(1); setError(''); setSuccessMsg(''); }}
                style={{
                  flex: 1, padding: 'var(--space-md)',
                  background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)',
                  borderRadius: 'var(--radius-xl)',
                  fontWeight: 700, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 2, padding: 'var(--space-md)',
                  background: 'var(--primary)', color: 'var(--on-primary)',
                  borderRadius: 'var(--radius-xl)',
                  fontWeight: 700, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">sync</span>
                ) : 'Verify Code'}
              </button>
            </div>
          </form>
        ) : (
          /* Forgot Password Step 3: Enter New Password */
          <form onSubmit={handleResetSubmit} style={{
            background: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-xl)',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <h4 style={{ margin: '0 0 16px', color: 'var(--on-surface)', fontSize: 16, fontWeight: 700 }}>
              Set New Password
            </h4>
            <p style={{ fontSize: 13, color: 'var(--outline)', marginBottom: 20, lineHeight: 1.4 }}>
              Choose a secure new password for your admin account.
            </p>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label className="text-label-sm" style={{
                display: 'block', color: 'var(--on-surface-variant)',
                marginBottom: 'var(--space-xs)', marginLeft: 4,
              }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 'var(--space-md)', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>lock_open</span>
                </div>
                <input
                  type="password"
                  disabled={loading}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  style={{
                    width: '100%', padding: 'var(--space-md)', paddingLeft: 48,
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: 16, color: 'var(--on-surface)',
                    opacity: loading ? 0.6 : 1,
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label className="text-label-sm" style={{
                display: 'block', color: 'var(--on-surface-variant)',
                marginBottom: 'var(--space-xs)', marginLeft: 4,
              }}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 'var(--space-md)', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>lock</span>
                </div>
                <input
                  type="password"
                  disabled={loading}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  style={{
                    width: '100%', padding: 'var(--space-md)', paddingLeft: 48,
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: 16, color: 'var(--on-surface)',
                    opacity: loading ? 0.6 : 1,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                type="button"
                onClick={() => { setForgotStep(2); setError(''); setSuccessMsg(''); }}
                style={{
                  flex: 1, padding: 'var(--space-md)',
                  background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)',
                  borderRadius: 'var(--radius-xl)',
                  fontWeight: 700, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 2, padding: 'var(--space-md)',
                  background: 'var(--primary)', color: 'var(--on-primary)',
                  borderRadius: 'var(--radius-xl)',
                  fontWeight: 700, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">sync</span>
                ) : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'var(--space-xs)', margin: 'var(--space-lg) auto 0',
            color: 'var(--on-surface-variant)', fontSize: 14,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          Back to Store
        </button>
      </div>
    </div>
  );
}
