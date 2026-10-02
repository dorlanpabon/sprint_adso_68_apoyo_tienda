package com.tuyweb.sprint_adso_68_apoyo.sale.payment;

import java.math.BigDecimal;

/**
 * Punto de extensión para pasarela real (Stripe, PayU, MercadoPago...).
 * Por ahora solo existe MockPaymentGateway (siempre aprueba).
 * Para integrar una real: implementa esta interfaz y márcala como @Primary.
 */
public interface PaymentGateway {
    PaymentResult charge(BigDecimal total, String method);

    record PaymentResult(boolean approved, String reference, String message) {}
}
