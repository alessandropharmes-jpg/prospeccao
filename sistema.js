// Descobre o endereço atual do sistema (link.json, atualizado sozinho pelo próprio sistema)
// e liga o formulário da página a ele. Uso: conectar('/api/auth/form-login', form, box)
window.lerHash = () => new URLSearchParams(location.hash.slice(1));

window.conectar = async (rota, form, box, aoConectar) => {
  const show = (html) => { box.innerHTML = html; box.hidden = false; };
  let info;
  try {
    info = await fetch('link.json?t=' + Date.now(), { cache: 'no-store' }).then((r) => r.json());
  } catch {
    return show('<p class="err">Não foi possível ler o endereço do sistema. Tente recarregar a página.</p>');
  }
  if (!info || !info.url) return show('<p class="err">O sistema está sem endereço público no momento (acesso pela internet desligado).</p>');
  // Confere se o endereço responde (o PC pode estar desligado)
  try {
    await fetch(info.url + '/api/auth/state', { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(12000) });
  } catch {
    return show(`<p class="err"><b>O sistema está fora do ar agora.</b></p>
      <p>O computador que roda o sistema pode estar desligado, sem internet, ou acabou de trocar de endereço.
      Aguarde um ou dois minutos e recarregue esta página.</p>
      <a class="btn" href="">Tentar de novo</a>`);
  }
  form.action = info.url + rota;
  box.hidden = true;
  form.hidden = false;
  if (aoConectar) aoConectar(info.url);
};

window.mostrarErro = (el, texto) => {
  if (!texto) return;
  el.textContent = texto;
  el.hidden = false;
};
