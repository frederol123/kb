import { Link } from 'react-router-dom';

const deliveryZones = [
  {
    title: 'Москва и Московская область',
    price: '350 ₽',
    time: '2–3 рабочих дня',
    note: 'Курьерская доставка до двери',
  },
  {
    title: 'Санкт-Петербург и Ленинградская область',
    price: '450 ₽',
    time: '3–5 рабочих дней',
    note: 'Курьерская доставка до двери',
  },
  {
    title: 'Центральный федеральный округ',
    price: 'от 350 ₽',
    time: '3–6 рабочих дней',
    note: 'Почта России / СДЭК',
  },
  {
    title: 'Остальные регионы России',
    price: 'от 500 ₽',
    time: '5–14 рабочих дней',
    note: 'Почта России / СДЭК',
  },
  {
    title: 'Отдалённые районы (Дальний Восток, Сибирь, Крайний Север)',
    price: 'от 700 ₽',
    time: '10–20 рабочих дней',
    note: 'Почта России',
  },
];

export default function DeliveryPage() {
  return (
    <section className="single-content">
      <div className="container">
        <h1 className="section-title single-content__title">Доставка</h1>

        <div className="text-[#1c2145] leading-relaxed space-y-6 max-w-3xl">
          <p>
            Мы осуществляем доставку металлических табличек с QR-кодом по всей территории
            Российской Федерации. Стоимость и сроки зависят от региона и выбранного способа доставки.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-3">Способы доставки</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Курьерская служба (СДЭК)</strong> — доставка до двери или до пункта выдачи. Подходит для городов присутствия СДЭК.</li>
            <li><strong>Почта России</strong> — доставка в любое отделение связи на территории РФ. Отправляется заказным письмом или посылкой 1-го класса.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-3">Сроки и стоимость</h2>
          <p>Точная стоимость рассчитывается автоматически при оформлении заказа. Ориентировочные тарифы:</p>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-[#1c2145]">Регион</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1c2145]">Стоимость</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1c2145]">Срок</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1c2145]">Способ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deliveryZones.map((z, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{z.title}</td>
                    <td className="px-4 py-3">{z.price}</td>
                    <td className="px-4 py-3">{z.time}</td>
                    <td className="px-4 py-3 text-[#6c6d7e]">{z.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold mt-8 mb-3">Бесплатная доставка</h2>
          <p>
            При заказе от <strong>10 000 ₽</strong> — доставка по России бесплатно
            (за исключением отдалённых районов).
          </p>

          <h2 className="text-xl font-bold mt-8 mb-3">Сроки изготовления</h2>
          <p>
            Табличка изготавливается в течение <strong>1–3 рабочих дней</strong> после оплаты заказа.
            Общий срок «под ключ» (изготовление + доставка) составляет от 3 до 20 рабочих дней
            в зависимости от региона.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-3">Отслеживание</h2>
          <p>
            После отправки вы получаете трек-номер, по которому можно отследить посылку
            на сайте Почты России или СДЭК.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-3">Важно</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Доставка осуществляется только на территории РФ.</li>
            <li>Убедитесь в правильности адреса при оформлении заказа.</li>
            <li>При получении проверьте целостность упаковки и содержимого.</li>
          </ul>

          <p className="mt-8 text-[#6c6d7e]">
            Если у вас остались вопросы — свяжитесь с нами в Telegram или WhatsApp.
          </p>
        </div>

        <div className="mt-8 pb-10">
          <Link to="/tariffs" className="button button--filled" style={{ display: 'inline-flex' }}>
            ← К тарифам
          </Link>
        </div>
      </div>
    </section>
  );
}
