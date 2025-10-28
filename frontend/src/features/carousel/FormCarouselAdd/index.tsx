import React, { useState } from 'react';
import { useCarouselForm } from '../useCarouselForm'; // Usa o mesmo hook
import type { CarouselResponseType, CollectionType } from '../carousel.types'; // Importar CollectionType

// --- Componente de Linha (Itens Inativos) ---
const InactiveItemRow: React.FC<{ 
    item: CarouselResponseType, 
    // Tipo corrigido: Agora handleActivate recebe o item completo
    handleActivate: (item: CarouselResponseType) => Promise<{ success: boolean, message: string }>,
    isSaving: boolean,
}> = ({ item, handleActivate, isSaving }) => {
    
    const [rowFeedback, setRowFeedback] = useState('');
    
    const activateItem = async () => {
        setRowFeedback('Adicionando...');
        
        // A função de ativação já está tipada para aceitar o item completo
        const result = await handleActivate(item); 
        
        setRowFeedback(result.message);
        setTimeout(() => setRowFeedback(''), 4000);
    };

    const typeColor = item.collection_type === 'project' ? 'text-blue-600' : 'text-green-600';

    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="px-6 py-3 font-medium text-gray-900">
                {item.title} 
                <span className={`ml-2 text-xs font-semibold ${typeColor}`}>
                    [{item.collection_type.toUpperCase()}]
                </span>
            </td>
            <td className="px-6 py-3 text-center">
                <button
                    onClick={activateItem}
                    disabled={isSaving}
                    className={`px-4 py-1 rounded text-white text-xs font-bold transition-colors 
                        ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {rowFeedback || 'Adicionar ao Carrossel'}
                </button>
            </td>
        </tr>
    );
};


export const FormCarouselAdd: React.FC = () => {
    const { state, actions } = useCarouselForm();
    const { isLoading, error, inactiveItems, isSaving } = state;
    const { handleActivateItem } = actions;

    // --- CORREÇÃO CRÍTICA: WRAPPER DA FUNÇÃO DE ATIVAÇÃO ---
    // Criamos uma função que aceita o item (do map) e chama a função do hook com os argumentos separados.
    const activateItemWrapper = (item: CarouselResponseType) => {
        // O hook espera type e id separados. Aqui fazemos a extração e o casting seguro.
        const type = item.collection_type as CollectionType;
        const id = item._id;
        
        return handleActivateItem(type, id);
    };
    // ----------------------------------------------------


    if (isLoading) {
        return <div className="text-center py-8 text-gray-400">Buscando itens para adicionar...</div>;
    }

    if (error) {
        return <div className="text-red-600 text-center py-8">{error}</div>;
    }

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Adicionar Destaques (Itens Inativos)</h2>
            
            {inactiveItems.length === 0 ? (
                <p className="text-gray-600">Todos os itens disponíveis já estão marcados como candidatos ao carrossel.</p>
            ) : (
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="py-2 px-4">Item (Inativo)</th>
                                <th className="py-2 px-4 text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inactiveItems.map(item => (
                                <InactiveItemRow 
                                    key={item._id} 
                                    item={item} 
                                    // NOVO: Passa o wrapper que resolve a tipagem
                                    handleActivate={activateItemWrapper} 
                                    isSaving={isSaving}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};