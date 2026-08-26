function Dashboard(){



    return(

        
        <div>
            <div className="flex flex-col text-center mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <p className="text-gray-700">Bem-vindo ao seu dashboard! Acompanhe suas atividades, visualize estatísticas e gerencie suas configurações.</p>
            </div>
            <div className="w-full h-full flex flex-row items-center justify-center p-4">
                <div className="w-1/3 h-64 bg-blue-100 rounded-lg shadow-md flex items-center justify-center">
                    <p className="text-lg font-semibold text-blue-600">Dados do seu negócio</p>
                </div>
                <div className="w-1/3 h-64 bg-green-100 rounded-lg shadow-md flex items-center justify-center">
                    <p className="text-lg font-semibold text-green-600">Atividades Recentes</p>
                </div>
                <div className="w-1/3 h-64 bg-yellow-100 rounded-lg shadow-md flex items-center justify-center">
                    <p className="text-lg font-semibold text-yellow-600">Aulas/matérias</p>
                </div>
            </div>
            


        </div>





    )



}

export default Dashboard