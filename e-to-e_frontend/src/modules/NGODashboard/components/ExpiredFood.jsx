import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNGO } from '../context/NGOContext'
import { animateRowsStagger } from '../animations/ngoAnimations'

export default function ExpiredFood() {
    const { t } = useTranslation('dashboard')
    const { claims, loading, errors, fetchClaims } = useNGO()

    useEffect(() => {
        if (!loading.claims && claims.length > 0) {
            animateRowsStagger('.ngo-expired-row')
        }
    }, [claims, loading.claims])

    if (loading.claims && claims.length === 0) {
        return (
            <div className="ngo-table-wrap">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="ngo-skeleton-row"><div className="ngo-skeleton-line" /></div>
                ))}
            </div>
        )
    }

    if (errors.claims) {
        return (
            <div className="ngo-error-state">
                <span className="ngo-error-state__icon">⚠</span>
                <p>{errors.claims}</p>
                <button className="ngo-btn ngo-btn--outline" onClick={fetchClaims}>{t('retry', { ns: 'common' })}</button>
            </div>
        )
    }

    const expiredClaims = claims.filter(claim => {
        const isCompleted = claim.status === 'completed' || claim.status === 'picked';
        const isExpired = claim.food_listings?.expiry_time && new Date(claim.food_listings.expiry_time) < new Date();
        return !isCompleted && isExpired;
    })

    if (expiredClaims.length === 0) {
        return (
            <div className="ngo-empty-state">
                <span className="ngo-empty-state__icon">☐</span>
                <h4>No Expired Food</h4>
                <p>All accepted donations are active or completed.</p>
            </div>
        )
    }

    return (
        <div className="ngo-table-wrap ngo-scroll-table">
            <table className="ngo-table">
                <thead>
                    <tr>
                        <th>{t('ngo.donation')}</th>
                        <th>{t('ngo.donor')}</th>
                        <th>{t('ngo.pickupTime')}</th>
                        <th>{t('status')}</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {expiredClaims.map((claim) => {
                        const listing = claim.food_listings || {}
                        const donorName = listing.donors?.profiles?.organization_name || '—'
                        const donorPhone = listing.donors?.profiles?.phone || '—'

                        return (
                            <tr key={claim.claim_id} className="ngo-expired-row">
                                <td>
                                    <div className="ngo-cell-main">{listing.food_type || '—'}</div>
                                    <div className="ngo-cell-sub">{listing.quantity_kg ? `${listing.quantity_kg} kg` : ''}</div>
                                </td>
                                <td>
                                    <div className="ngo-cell-main">{donorName}</div>
                                    <div className="ngo-cell-sub">{donorPhone}</div>
                                </td>
                                <td>
                                    {claim.pickup_scheduled_time
                                        ? new Date(claim.pickup_scheduled_time).toLocaleString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })
                                        : '—'}
                                </td>
                                <td>
                                    <span className={`ngo-badge ngo-badge--error`}>
                                        Expired
                                    </span>
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        Not picked up in time.
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
