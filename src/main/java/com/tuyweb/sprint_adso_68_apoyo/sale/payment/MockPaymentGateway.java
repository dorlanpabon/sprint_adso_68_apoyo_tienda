package com.tuyweb.sprint_adso_68_apoyo.sale.payment;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.UUID;

@Component
public class MockPaymentGateway implements PaymentGateway {
    @Override
    public PaymentResult charge(BigDecimal total, String method) {
        // TODO: reemplazar por Stripe/PayU/MercadoPago. Firma lista para inyectar.
        return new PaymentResult(true, "MOCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(), "Pago simulado OK");
    }
}
