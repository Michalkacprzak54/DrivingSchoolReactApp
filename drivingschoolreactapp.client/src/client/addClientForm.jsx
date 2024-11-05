import React, { useState } from 'react';

function AddClientForm() {
    const [formData, setFormData] = useState({
        clientFirstName: '',
        clientLastName: '',
        clientBirthDay: '',
        clientPhoneNumber: '',
        clientEmail: '',
        clientPassword: '',
        zipCode: { zipCodeNumber: '' },  // Obiekt ZipCode
        city: { cityName: '' },          // Obiekt City
        clientHouseNumber: '',
        clientFlatNumber: '',
        clientStatus: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        // Sprawdzenie, czy pole dotyczy zipCode lub city
        if (name.startsWith("zipCode") || name.startsWith("city")) {
            const objectName = name.startsWith("zipCode") ? "zipCode" : "city";
            const propertyName = name.charAt(0).toLowerCase() + name.slice(1); // Pobieramy nazwê w³aœciwoœci

            setFormData((prevState) => ({
                ...prevState,
                [objectName]: {
                    ...prevState[objectName],
                    [propertyName]: fieldValue,
                },
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: fieldValue,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:7056/api/Client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Klient zosta³ dodany pomyœlnie!');
                setFormData({
                    clientFirstName: '',
                    clientLastName: '',
                    clientBirthDay: '',
                    clientPhoneNumber: '',
                    clientEmail: '',
                    clientPassword: '',
                    zipCode: { zipCodeNumber: '' },
                    city: { cityName: '' },
                    clientHouseNumber: '',
                    clientFlatNumber: '',
                    clientStatus: false,
                });
            } else {
                alert('Wyst¹pi³ b³¹d podczas dodawania klienta.');
            }
        } catch (error) {
            console.error('B³¹d:', error);
            alert('Wyst¹pi³ b³¹d podczas dodawania klienta.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Imiê:
                <input type="text" name="clientFirstName" value={formData.clientFirstName} onChange={handleChange} required />
            </label>
            <label>
                Nazwisko:
                <input type="text" name="clientLastName" value={formData.clientLastName} onChange={handleChange} required />
            </label>
            <label>
                Data urodzenia:
                <input type="date" name="clientBirthDay" value={formData.clientBirthDay} onChange={handleChange} required />
            </label>
            <label>
                Numer telefonu:
                <input type="text" name="clientPhoneNumber" value={formData.clientPhoneNumber} onChange={handleChange} required />
            </label>
            <label>
                Email:
                <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} required />
            </label>
            <label>
                Has³o:
                <input type="password" name="clientPassword" value={formData.clientPassword} onChange={handleChange} required />
            </label>
            <label>
                Kod pocztowy:
                <input type="text" name="zipCodeNumber" value={formData.zipCode.zipCodeNumber} onChange={handleChange} required />
            </label>
            <label>
                Miasto:
                <input type="text" name="cityName" value={formData.city.cityName} onChange={handleChange} required />
            </label>
            <label>
                Numer domu:
                <input type="text" name="clientHouseNumber" value={formData.clientHouseNumber} onChange={handleChange} required />
            </label>
            <label>
                Numer lokalu:
                <input type="number" name="clientFlatNumber" value={formData.clientFlatNumber} onChange={handleChange} />
            </label>
            <label>
                Status kursanta:
                <input type="checkbox" name="clientStatus" checked={formData.clientStatus} onChange={handleChange} />
            </label>
            <button type="submit">Dodaj klienta</button>
        </form>
    );
}

export default AddClientForm;
