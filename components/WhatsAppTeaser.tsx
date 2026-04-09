export default function WhatsAppTeaser() {
  return (
    <section className="py-10 px-4 sm:px-10 border-t border-green-100" style={{ background: '#F0FDF4', borderColor: '#D1FAE5' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A2E] mb-3">Em breve: busca pelo WhatsApp</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Mande a localização ou as coordenadas pelo WhatsApp e receba as informações
            da propriedade rural — CAR, área, status e KML — diretamente na conversa.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-bold">
            💬 Em breve no WhatsApp
          </div>
        </div>

        {/* Chat mockup */}
        <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: '#ECE5DD' }}>
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#075E54' }}>
            <div className="w-9 h-9 bg-[#40916C] rounded-full flex items-center justify-center text-base flex-shrink-0">🌿</div>
            <div>
              <div className="text-white text-sm font-semibold">Talhão</div>
              <div className="text-white/70 text-xs">online</div>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <div className="ml-auto max-w-[85%] bg-[#DCF8C6] rounded-lg rounded-tr-sm px-3 py-2 text-xs leading-relaxed">
              Oi! Preciso do CAR dessa fazenda aqui 📍 [-14.235, -51.925]
              <div className="text-gray-400 text-right text-[10px] mt-1">14:32 ✓✓</div>
            </div>
            <div className="mr-auto max-w-[85%] bg-white rounded-lg rounded-tl-sm px-3 py-2 text-xs leading-relaxed">
              Encontrei! 🌿 <strong>Fazenda Santa Clara</strong><br />
              CAR: MT-5107602-XXXXXX<br />
              Área: 1.243,5 ha | Status: Ativo<br />
              <span className="text-[#25D366]">📥 Baixar KML</span>
              <div className="text-gray-400 text-right text-[10px] mt-1">14:32</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
