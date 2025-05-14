export default function handler(req, res) {
  const host = req.headers.host;
  const appUrl = `https://${host}`;

  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:type="MessageRead">
  <Id>12345678-1234-1234-1234-123456789abc</Id>
  <Version>1.0.0.0</Version>
  <ProviderName>Vue Refiner</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue="Mail Refiner AI" />
  <Description DefaultValue="潤色與翻譯你的郵件文字" />
  <IconUrl DefaultValue="${appUrl}/icon.png"/>
  <HighResolutionIconUrl DefaultValue="${appUrl}/icon.png"/>
  <Hosts>
    <Host Name="Mailbox"/>
  </Hosts>
  <Requirements>
    <Sets>
      <Set Name="Mailbox" MinVersion="1.5"/>
    </Sets>
  </Requirements>
  <FormSettings>
    <Form xsi:type="MessageRead">
      <DesktopSettings>
        <SourceLocation DefaultValue="${appUrl}/" />
        <RequestedHeight>350</RequestedHeight>
      </DesktopSettings>
    </Form>
  </FormSettings>
  <Permissions>ReadItem</Permissions>
</OfficeApp>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(manifest);
}
