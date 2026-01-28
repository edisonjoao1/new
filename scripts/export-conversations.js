const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase
const serviceAccount = require('/Users/edison/Desktop/Inteligencia Artificial Gratis/serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function exportConversations() {
  console.log('Fetching conversations from Firebase...');

  const usersRef = db.collection('users');
  const usersSnapshot = await usersRef.get();

  let allConversations = [];
  let totalMessages = 0;

  console.log(`Found ${usersSnapshot.size} users`);

  for (const userDoc of usersSnapshot.docs) {
    const convosRef = usersRef.doc(userDoc.id).collection('conversations');
    const convosSnapshot = await convosRef.get();

    for (const convoDoc of convosSnapshot.docs) {
      const convo = convoDoc.data();
      if (convo.messages && convo.messages.length > 0) {
        allConversations.push({
          user_id: userDoc.id.substring(0, 8) + '...', // Anonymize
          conversation_id: convoDoc.id.substring(0, 8) + '...',
          messages: convo.messages,
          message_count: convo.message_count || convo.messages.length,
          title: convo.title || 'Untitled'
        });
        totalMessages += convo.messages.length;
      }
    }
  }

  console.log(`Exported ${allConversations.length} conversations with ${totalMessages} total messages`);

  // Save to file
  const outputPath = path.join(__dirname, 'conversations-export.json');
  fs.writeFileSync(outputPath, JSON.stringify(allConversations, null, 2));
  console.log(`Saved to ${outputPath}`);

  // Also output to stdout for immediate use
  return allConversations;
}

exportConversations()
  .then(convos => {
    // Print sample for analysis
    console.log('\n=== SAMPLE CONVERSATIONS FOR ANALYSIS ===\n');
    convos.slice(0, 30).forEach((convo, i) => {
      console.log(`\n--- Conversation ${i + 1} (${convo.message_count} messages) ---`);
      convo.messages.forEach(msg => {
        const role = msg.role === 'user' ? 'USER' : 'AI';
        const content = msg.content.substring(0, 500) + (msg.content.length > 500 ? '...' : '');
        console.log(`${role}: ${content}\n`);
      });
    });
  })
  .catch(console.error);
