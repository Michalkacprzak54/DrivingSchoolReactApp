//import React from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';

function PkkPage() {
    return (
        <div className="pkk-page" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            <header className="pkk-header bg-light py-4 border-bottom">
                <div className="container text-center">
                    <h1 className="pkk-title display-4">Informacje o PKK i kursach prawa jazdy</h1>
                </div>
            </header>

            <main className="pkk-main container my-5">
                {/* Sekcja Jak założyć PKK */}
                <section id="pkk" className="pkk-section mb-5 p-4 border rounded shadow-sm bg-white">
                    <h2 className="section-title h3 mb-4">Jak założyć PKK?</h2>
                    <ol className="list-group list-group-numbered">
                        <li className="list-group-item">
                            <strong>Zbierz dokumenty:</strong>
                            <ul className="list-unstyled mt-2">
                                <li>- Orzeczenie lekarskie (polecamy gabinet <a href="#">test</a>)</li>
                                <li>- Zdjęcie do prawa jazdy - <a href="https://www.gov.pl/web/gov/zdjecie-do-prawa-jazdy" target="_blank" rel="noopener noreferrer">wymagania</a></li>
                                <li>- Dokument potwierdzający tożsamość (dowód osobisty / paszport)</li>
                                <li>- W przypadku braku ukończenia 18 lat - <a href="https://bip-v1-files.idcom-jst.pl/sites/46458/bip_sprawy/3228/zgoda_rodzica_lub_opiekuna_na_uczestniczenie_w_kursie_na_prawo_jazdy.pdf" target="_blank" rel="noopener noreferrer">zgoda rodziców</a></li>
                                <li>
                                    - Kategorie C, CE, D - dodatkowo:
                                    <ul className="list-unstyled ms-3">
                                        <li>- Ksero posiadanego prawa jazdy</li>
                                        <li>- Orzeczenie psychologiczne (polecamy pracownię <a href="#">Test1</a>)</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        <li className="list-group-item">
                            <strong>Złóż dokumenty:</strong>
                            <ul className="list-unstyled mt-2">
                                <li>- Mieszkańcy Płocka - <a href="https://nowybip.plock.eu/sprawa/68jVOICb" target="_blank" rel="noopener noreferrer">Wydział Komunikacji Urząd Miasta w Płocku, ul. Piłsudskiego 6</a></li>
                                <li>- Osoby spoza Płocka - <a href="https://bip.powiat-plock.pl/sprawy/3228/wydanie_profilu_kandydata_na_kierowce" target="_blank" rel="noopener noreferrer">Wydział Komunikacji - Starostwo Powiatowe w Płocku, ul. Bielska 59</a></li>
                                <li>- Online - <a href="https://info-car.pl/new/aktualnosci/2314" target="_blank" rel="noopener noreferrer">instrukcja</a></li>
                            </ul>
                        </li>

                        <li className="list-group-item">
                            <strong>Przekaż nam PKK przed rozpoczęciem szkolenia:</strong>
                            <ul className="list-unstyled mt-2">
                                <li>- Do siedziby OSK Test Test: Płock, ul. Taka i taka 33</li>
                                <li>- <a href="/service/1">Przez naszą stronę</a></li>
                            </ul>
                        </li>
                    </ol>
                </section>

                {/* Sekcja Jak zapisać się na kurs */}
                <section id="kurs" className="pkk-section mb-5 p-4 border rounded shadow-sm bg-white">
                    <h2 className="section-title h3 mb-4">Jak zapisać się na kurs?</h2>
                    <ol className="list-group list-group-numbered">
                        <li className="list-group-item">Dodaj wybrany kurs do koszyka</li>
                        <li className="list-group-item">Zdobyć potrzebne dokumenty i wyślij zgłoszenie przez stronę lub skontaktuj się z nami</li>
                        <li className="list-group-item">Ustal harmonogram zajęć teoretycznych i praktycznych (stacjonarnie lub online)</li>
                        <li className="list-group-item">Rozpocznij szkolenie i przygotowanie do egzaminu państwowego.</li>
                    </ol>
                </section>
            </main>
        </div>
    );
}

export default PkkPage;
