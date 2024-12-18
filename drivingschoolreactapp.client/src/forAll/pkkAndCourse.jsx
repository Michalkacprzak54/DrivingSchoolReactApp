import React from 'react';

function PkkPage() {
    return (
        <div className="pkk-page">
            <header className="pkk-header">
                <h1 className="pkk-title">Informacje o PKK i kursach prawa jazdy</h1>
            </header>

            <main className="pkk-main">
                {/* Sekcja Jak założyć PKK */}
                <section id="pkk" className="pkk-section">
                    <h2 className="section-title">Jak założyć PKK?</h2>
                    <ol className="pkk-list">
                        <li className="pkk-list-item">
                            <strong>Zbierz dokumenty:</strong>
                            <ul className="pkk-documents">
                                <li>Orzeczenie lekarskie (polecamy gabinet <a href="#">test</a>)</li>
                                <li>Zdjęcie do prawa jazdy - <a href="https://www.gov.pl/web/gov/zdjecie-do-prawa-jazdy" target="_blank" rel="noopener noreferrer">wymagania</a></li>
                                <li>Dokument potwierdzający tożsamość (dowód osobisty / paszport)</li>
                                <li>W przypadku braku ukończenia 18 lat <a href="https://bip-v1-files.idcom-jst.pl/sites/46458/bip_sprawy/3228/zgoda_rodzica_lub_opiekuna_na_uczestniczenie_w_kursie_na_prawo_jazdy.pdf" target="_blank" rel="noopener noreferrer"> - zgoda rodziców</a></li>
                                <li>Kategorie C, CE, D - dodatkowo:
                                    <ul className="additional-documents">
                                        <li>Ksero posiadanego prawa jazdy</li>
                                        <li>Orzeczenie psychologiczne (polecamy pracownię <a href="#">Test1</a>)</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        <li className="pkk-list-item">
                            <strong>Złóż dokumenty:</strong>
                            <ul className="pkk-documents">
                                <li>Mieszkańcy Płocka - <a href="https://nowybip.plock.eu/sprawa/68jVOICb" target="_blank" rel="noopener noreferrer">Wydział Komunikacji Urząd Miasta w Płocku, ul. Piłsudskiego 6</a></li>
                                <li>Osoby spoza Płocka - <a href="https://bip.powiat-plock.pl/sprawy/3228/wydanie_profilu_kandydata_na_kierowce" target="_blank" rel="noopener noreferrer">Wydział Komunikacji - Starostwo Powiatowe w Płocku, ul. Bielska 59</a></li>
                                <li>Online - <a href="https://info-car.pl/new/aktualnosci/2314" target="_blank" rel="noopener noreferrer">instrukcja</a></li>
                            </ul>
                        </li>

                        <li className="pkk-list-item">
                            <strong>Przekaż nam PKK przed rozpoczęciem szkolenia:</strong>
                            <ul className="pkk-documents">
                                <li>Do siedziby OSK Test Test: Płock, ul. Taka i taka 33</li>
                                <li><a href="/service/1">Przez naszą stronę</a></li>
                            </ul>
                        </li>
                    </ol>
                </section>

                {/* Sekcja Jak zapisać się na kurs */}
                <section id="kurs" className="pkk-section">
                    <h2 className="section-title">Jak zapisać się na kurs?</h2>
                    <ol className="pkk-list">
                        <li className="pkk-list-item"><a href="#">Dodaj wybrany kurs do koszyka</a></li>
                        <li className="pkk-list-item">Zdobyć potrzebne dokumenty i wyślij zgłoszenie</li>
                        <li className="pkk-list-item">Ustal harmonogram zajęć teoretycznych i praktycznych (stacjonarnie lub online)</li>
                        <li className="pkk-list-item">Rozpocznij szkolenie i przygotowanie do egzaminu państwowego.</li>
                    </ol>
                </section>
            </main>

            <footer className="pkk-footer">
                <p>&copy; 2024 Informacje o PKK i kursach. Wszystkie prawa zastrzeżone.</p>
            </footer>
        </div>
    );
}

export default PkkPage;
