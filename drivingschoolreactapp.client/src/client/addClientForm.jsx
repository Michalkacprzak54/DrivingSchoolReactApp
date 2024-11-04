import { useState } from 'react';
import PropTypes from 'prop-types'; // Importuj PropTypes
import { addClient } from '../services/apiService';

function AddClientForm({ onClientAdded }) {
    const [formData, setFormData] = useState({
        clientFirstName: '',
        clientLastName: '',
        clientBirthDay: '',
        clientPhoneNumber: '',
        clientEmail: '',
        clientHouseNumber: '',
        clientFlatNumber: '',
        clientStatus: true,
        clientZipCode: '',
        clientCity: ''
    });
    const [error, setError] = useState(null);

    // Obs³uguje zmianê w formularzu
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Obs³uguje wysy³anie formularza
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Resetuje b³¹d przed now¹ prób¹

        try {
            const response = await addClient(formData); // Wywo³uje funkcjê dodaj¹c¹ klienta
            onClientAdded(response.data); // Dodaje nowego klienta do listy
        } catch (error) {
            console.error("B³¹d podczas dodawania klienta:", error);
            setError("Nie uda³o siê dodaæ klienta. Spróbuj ponownie.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Dodaj klienta</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input type="text" name="clientFirstName" placeholder="Imiê" onChange={handleChange} value={formData.clientFirstName} required />
            <input type="text" name="clientLastName" placeholder="Nazwisko" onChange={handleChange} value={formData.clientLastName} required />
            <input type="date" name="clientBirthDay" onChange={handleChange} value={formData.clientBirthDay} required />
            <input type="text" name="clientPhoneNumber" placeholder="Numer telefonu" onChange={handleChange} value={formData.clientPhoneNumber} />
            <input type="email" name="clientEmail" placeholder="Email" onChange={handleChange} value={formData.clientEmail} required />
            <input type="text" name="clientHouseNumber" placeholder="Numer domu" onChange={handleChange} value={formData.clientHouseNumber} />
            <input type="text" name="clientFlatNumber" placeholder="Numer mieszkania" onChange={handleChange} value={formData.clientFlatNumber} />
            <select name="clientStatus" onChange={handleChange} value={formData.clientStatus}>
                <option value={true}>Aktywny</option>
                <option value={false}>Nieaktywny</option>
            </select>
            <input type="text" name="clientZipCode" placeholder="Kod pocztowy ID" onChange={handleChange} value={formData.clientZipCode} />
            <input type="text" name="clientCity" placeholder="ID Miasta" onChange={handleChange} value={formData.clientCity} />
            <button type="submit">Dodaj klienta</button>
        </form>
    );
}

// Dodajemy PropTypes, aby zdefiniowaæ onClientAdded jako wymagany
AddClientForm.propTypes = {
    onClientAdded: PropTypes.func.isRequired,
};

export default AddClientForm;
