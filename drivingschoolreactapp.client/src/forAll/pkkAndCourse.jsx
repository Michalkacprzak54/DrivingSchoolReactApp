import React from 'react';

function PkkPage() {
    return (
        <div className="PkkPage">
            <header className="PkkPage-header">
                <h1>Informacje o PKK i kursach prawa jazdy</h1>
            </header>

            <main>
                {/* Sekcja Jak założyć PKK */}
                <section id="pkk" className="section">
                    <h2>Jak założyć PKK?</h2>
                    <ol>
                        <li>
                            <strong>Zbierz dokumenty:</strong>
                            <ul>
                                <li>Orzeczenie lekarskie (polecamy gabinet <a href="#"> test</a>)</li>
                                <li>Zdjęcie do prawa jazdy - <a href="https://www.gov.pl/web/gov/zdjecie-do-prawa-jazdy" target="_blank">wymagania</a></li>
                                <li>Dokument potwierdzający tożsamość (dowód osobisty / paszport)</li>
                                <li>W przypadku braku ukończenia 18 lat <a href="https://bip-v1-files.idcom-jst.pl/sites/46458/bip_sprawy/3228/zgoda_rodzica_lub_opiekuna_na_uczestniczenie_w_kursie_na_prawo_jazdy.pdf" target="_blank"> - zgoda rodziców</a></li>
                                <li>Kategorie C, CE, D - dodatkowo:
                                    <ul>
                                        <li>Ksero posiadanego prawa jazdy</li>
                                        <li>Orzeczenie psychologiczne (polecamy pracownię <a href="#">Test1</a>)</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <strong>Złóż dokumenty:</strong>
                            <ul>
                                <li>Mieszkańcy Płocka - <a href="https://nowybip.plock.eu/sprawa/68jVOICb" target="_blank">Wydział Komunikacji Urząd Miasta w Płocku, ul. Piłsudskiego 6</a></li>
                                <li>Osoby spoza Płockaa - <a href="https://bip.powiat-plock.pl/sprawy/3228/wydanie_profilu_kandydata_na_kierowce" target="_blank">Wydział Komunikacji - Starostwo Powiatowe w Płocku, ul. Bielska 59</a></li>
                                <li>Online - <a href="https://info-car.pl/new/aktualnosci/2314" target="_blank">instrukcja</a></li>
                            </ul>
                        </li>

                        <li>
                            <strong>Przekaż nam PKK przed rozpoczęciem szkolenia:</strong>
                            <ul>
                                <li>Do siedziby OSK Test Test: Płock, ul. Taka i taka 33</li>
                                <li>Przez stronę</li>
                            </ul>
                        </li>
                    </ol>
                </section>

                <section id="kurs" className="section">
                    <h2>Jak zapisać się na kurs?</h2>
                    <ol>
                        <li><a href="">Dodaj wybrany kurs do koszyka</a></li>
                        <li>Zdoboądź potrzebne dokumenty i wyślij zgłoszenie </li>
                        <li>Ustal harmonogram zajęć teoretycznych i praktycznych (stacjonarnie lub online)</li>
                        <li>Rozpocznij szkolenie i przygotowanie do egzaminu państwowego.</li>
                    </ol>
                </section>
            </main>

            <footer className="PkkPage-footer">
                <p>&copy; 2024 Informacje o PKK i kursach. Wszystkie prawa zastrzeżone.</p>
            </footer>
        </div>
    );
}

export default PkkPage;
