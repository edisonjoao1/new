export interface NotificationTemplate {
  id: string
  label: string
  title: string
  body: string
  targetView: string
}

export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'win_back',
    label: 'Win Back',
    title: 'Te extrañamos, {name}',
    body: 'Tus conversaciones con {assistant_name} te esperan. Vuelve a explorar.',
    targetView: 'chat',
  },
  {
    id: 'feature_discovery',
    label: 'Feature Discovery',
    title: 'Algo nuevo para ti',
    body: 'Descubre lo que {assistant_name} puede hacer con imagenes y voz.',
    targetView: 'images',
  },
  {
    id: 'milestone',
    label: 'Milestone',
    title: 'Felicidades, {name}!',
    body: 'Has enviado {messages} mensajes. Tu IA sabe mucho de ti.',
    targetView: 'chat',
  },
  {
    id: 'billing_issue',
    label: 'Billing Issue',
    title: 'Tu suscripcion necesita atencion',
    body: 'Hay un problema con tu metodo de pago. Actualiza para no perder acceso.',
    targetView: 'chat',
  },
  {
    id: 'conversation_continuation',
    label: 'Continue Conversation',
    title: '{assistant_name} tiene algo para ti',
    body: '{memory_topic}',
    targetView: 'chat',
  },
]

export interface UserData {
  name?: string
  assistant_name?: string
  messages?: number
  memory_topic?: string
}

export function resolveTemplate(template: NotificationTemplate, userData: UserData): { title: string; body: string; targetView: string } {
  const replacements: Record<string, string> = {
    '{name}': userData.name || 'amigo',
    '{assistant_name}': userData.assistant_name || 'tu IA',
    '{messages}': String(userData.messages || 0),
    '{memory_topic}': userData.memory_topic || 'Tienes algo pendiente por explorar.',
  }

  let title = template.title
  let body = template.body

  for (const [key, value] of Object.entries(replacements)) {
    title = title.replaceAll(key, value)
    body = body.replaceAll(key, value)
  }

  return { title, body, targetView: template.targetView }
}
